import { z } from "zod";
import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import type {
    DbEmailBlast,
    DbEmailBlastAttachment,
    DbEmailBlastRecipient,
    EmailBlastAttachmentKind,
    User,
} from "@/types";
import { deleteStoredFile, saveUploadForBlast } from "@/lib/server/file-storage";

const emailSchema = z.string().trim().email();

export const createBlastSchema = z.object({
    subject: z.string().trim().min(1).max(120),
    body: z.string().trim().min(1).max(10000).refine((val) => {
        const tokens = val.match(/<<[^>]+>>/g) || [];
        return tokens.every((t) => /^<<[A-Z0-9_]+>>$/.test(t));
    }, { message: "Body contains invalid placeholders. Use format <<TOKEN_NAME>> (uppercase A-Z, 0-9, and underscore only)." }),
    contentMode: z.enum(["text", "html"]).default("text"),
    senderName: z.string().trim().min(1).max(120).optional(),
    senderEmail: z.string().trim().email().optional(),
    replyToEmail: z.string().trim().email().optional(),
    departmentId: z.string().trim().min(1),
    recipients: z.array(emailSchema).min(1),
    saveAsDraft: z.boolean().optional().default(true),
});

export const updateDraftSchema = z.object({
    blastId: z.string().trim().min(1),
    subject: z.string().trim().min(1).max(120),
    body: z.string().trim().min(1).max(10000).refine((val) => {
        const tokens = val.match(/<<[^>]+>>/g) || [];
        return tokens.every((t) => /^<<[A-Z0-9_]+>>$/.test(t));
    }, { message: "Body contains invalid placeholders. Use format <<TOKEN_NAME>> (uppercase A-Z, 0-9, and underscore only)." }),
    contentMode: z.enum(["text", "html"]).default("text"),
    senderName: z.string().trim().min(1).max(120).optional(),
    senderEmail: z.string().trim().email().optional(),
    replyToEmail: z.string().trim().email().optional(),
    recipients: z.array(emailSchema).min(1),
});

export const rejectSchema = z.object({
    blastId: z.string().trim().min(1),
    reason: z.string().trim().min(3).max(500),
});

export const blastIdSchema = z.object({
    blastId: z.string().trim().min(1),
});

export const EMAIL_BLAST_ATTACHMENT_LIMITS = {
    maxFilesPerBlast: 5,
    maxFileSizeBytes: 10 * 1024 * 1024,
    maxTotalBytes: 20 * 1024 * 1024,
} as const;

const ALLOWED_IMAGE_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
]);

const ALLOWED_FILE_MIME_TYPES = new Set([
    ...ALLOWED_IMAGE_MIME_TYPES,
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/csv",
    "text/plain",
]);

const ALLOWED_EXTENSIONS = new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".pdf",
    ".docx",
    ".xlsx",
    ".pptx",
    ".csv",
    ".txt",
]);

type BlastWithRecipients = {
    id: string;
    subject: string;
    body: string;
    contentMode: string;
    senderName: string | null;
    senderEmail: string | null;
    replyToEmail: string | null;
    status: "draft" | "pending_approval" | "approved" | "rejected" | "sent";
    composedBy: string;
    approvedBy: string | null;
    rejectedBy: string | null;
    rejectionReason: string | null;
    sentAt: Date | null;
    sentCount: number;
    departmentId: string;
    isArchived: boolean;
    createdAt: Date;
    recipients: Array<{
        id: string;
        blastId: string;
        email: string;
    }>;
};

type BlastAttachmentRecord = {
    id: string;
    blastId: string;
    kind: string;
    storageKey: string;
    publicUrl: string | null;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    checksumSha256: string;
    uploadedBy: string;
    createdAt: Date;
};

function toBlastDto(blast: BlastWithRecipients): DbEmailBlast {
    return {
        id: blast.id,
        subject: blast.subject,
        body: blast.body,
        contentMode: blast.contentMode as "text" | "html",
        senderName: blast.senderName ?? undefined,
        senderEmail: blast.senderEmail ?? undefined,
        replyToEmail: blast.replyToEmail ?? undefined,
        status: blast.status,
        composedBy: blast.composedBy,
        approvedBy: blast.approvedBy ?? undefined,
        rejectedBy: blast.rejectedBy ?? undefined,
        rejectionReason: blast.rejectionReason ?? undefined,
        sentAt: blast.sentAt?.toISOString(),
        sentCount: blast.sentCount,
        departmentId: blast.departmentId,
        createdAt: blast.createdAt.toISOString(),
        isArchived: blast.isArchived,
    };
}

function toRecipientDtos(blast: BlastWithRecipients): DbEmailBlastRecipient[] {
    return blast.recipients.map((recipient) => ({
        id: recipient.id,
        blastId: recipient.blastId,
        email: recipient.email,
    }));
}

function toAttachmentDto(attachment: BlastAttachmentRecord): DbEmailBlastAttachment {
    return {
        id: attachment.id,
        blastId: attachment.blastId,
        kind: attachment.kind as EmailBlastAttachmentKind,
        storageKey: attachment.storageKey,
        publicUrl: attachment.publicUrl ?? undefined,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
        checksumSha256: attachment.checksumSha256,
        uploadedBy: attachment.uploadedBy,
        createdAt: attachment.createdAt.toISOString(),
    };
}

function getAttachmentKindFromMime(mimeType: string): EmailBlastAttachmentKind {
    return ALLOWED_IMAGE_MIME_TYPES.has(mimeType) ? "image" : "file";
}

function getExtension(filename: string): string {
    const index = filename.lastIndexOf(".");
    if (index <= 0) return "";
    return filename.slice(index).toLowerCase();
}

function normalizeAttachmentFilename(filename: string): string {
    return filename.trim().replace(/\s+/g, " ").slice(0, 160);
}

function validateAttachmentInput(filename: string, mimeType: string, sizeBytes: number): void {
    const safeFilename = normalizeAttachmentFilename(filename);
    if (!safeFilename) throw new Error("Validation failed: filename is required");
    if (sizeBytes <= 0) throw new Error("Validation failed: zero-byte files are not allowed");
    if (sizeBytes > EMAIL_BLAST_ATTACHMENT_LIMITS.maxFileSizeBytes) throw new Error("Payload too large: file exceeds 10 MB limit");
    if (!ALLOWED_FILE_MIME_TYPES.has(mimeType)) throw new Error(`Unsupported media type: ${mimeType}`);
    if (!ALLOWED_EXTENSIONS.has(getExtension(safeFilename))) throw new Error("Unsupported media type: file extension is not allowed");
}

function ensureDepartmentAccess(user: User, departmentId: string): void {
    if (user.role === "admin") return;
    if (user.departmentId !== departmentId) {
        throw new Error("Forbidden: cross-department access is not allowed");
    }
}

function ensureManager(user: User): void {
    if (user.role === "admin") return;
    if (user.membershipRole !== "manager" && user.membershipRole !== "head") {
        throw new Error("Forbidden: manager role required");
    }
}

function ensureBlastMutable(blastStatus: DbEmailBlast["status"] | BlastWithRecipients["status"]): void {
    if (blastStatus === "sent") {
        throw new Error("Invalid transition: cannot edit attachments after blast is sent");
    }
}

async function getBlastOrThrow(blastId: string): Promise<BlastWithRecipients> {
    const blast = await prisma.emailBlast.findUnique({
        where: { id: blastId },
        include: {
            recipients: { orderBy: { email: "asc" } },
        },
    });

    if (!blast) throw new Error("Blast not found");
    return blast as BlastWithRecipients;
}

async function getBlastAttachmentStats(blastId: string): Promise<{ count: number; totalBytes: number }> {
    const aggregated = await prisma.emailBlastAttachment.aggregate({
        where: { blastId },
        _count: { _all: true },
        _sum: { sizeBytes: true },
    });

    return {
        count: aggregated._count._all,
        totalBytes: aggregated._sum.sizeBytes ?? 0,
    };
}

export async function listEmailBlasts(departmentId: string, user: User): Promise<{ blasts: DbEmailBlast[]; recipients: DbEmailBlastRecipient[] }> {
    ensureDepartmentAccess(user, departmentId);

    const blasts = (await prisma.emailBlast.findMany({
        where: { departmentId, isArchived: false },
        include: { recipients: { orderBy: { email: "asc" } } },
        orderBy: { createdAt: "desc" },
    })) as BlastWithRecipients[];

    return {
        blasts: blasts.map(toBlastDto),
        recipients: blasts.flatMap(toRecipientDtos),
    };
}

export async function createEmailBlast(input: z.infer<typeof createBlastSchema>, user: User): Promise<DbEmailBlast> {
    ensureDepartmentAccess(user, input.departmentId);

    const status = input.saveAsDraft ? "draft" : "pending_approval";
    const uniqueRecipients = Array.from(new Set(input.recipients.map((email) => email.trim().toLowerCase())));

    if (uniqueRecipients.length === 0) {
        throw new Error("Validation failed: at least one recipient is required");
    }

    const created = await prisma.emailBlast.create({
        data: {
            subject: input.subject,
            body: input.body,
            contentMode: input.contentMode,
            senderName: input.senderName,
            senderEmail: input.senderEmail?.toLowerCase(),
            replyToEmail: input.replyToEmail?.toLowerCase(),
            status,
            composedBy: user.id,
            departmentId: input.departmentId,
            recipients: { create: uniqueRecipients.map((email) => ({ email })) },
        },
        include: { recipients: true },
    });

    return toBlastDto(created as BlastWithRecipients);
}

export async function updateEmailBlastDraft(input: z.infer<typeof updateDraftSchema>, user: User): Promise<DbEmailBlast> {
    const blast = await getBlastOrThrow(input.blastId);
    ensureDepartmentAccess(user, blast.departmentId);

    if (blast.composedBy !== user.id && user.role !== "admin") {
        throw new Error("Forbidden: only the composer can edit this blast");
    }

    if (blast.status !== "draft") {
        throw new Error("Invalid transition: only draft blasts can be edited");
    }

    const uniqueRecipients = Array.from(new Set(input.recipients.map((email) => email.trim().toLowerCase())));

    const updated = await prisma.emailBlast.update({
        where: { id: blast.id },
        data: {
            subject: input.subject,
            body: input.body,
            contentMode: input.contentMode,
            senderName: input.senderName,
            senderEmail: input.senderEmail?.toLowerCase(),
            replyToEmail: input.replyToEmail?.toLowerCase(),
            recipients: {
                deleteMany: {},
                create: uniqueRecipients.map((email) => ({ email })),
            },
        },
        include: { recipients: true },
    });

    return toBlastDto(updated as BlastWithRecipients);
}

export async function submitEmailBlast(blastId: string, user: User): Promise<DbEmailBlast> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);

    if (blast.composedBy !== user.id && user.role !== "admin") {
        throw new Error("Forbidden: only the composer can submit this blast");
    }

    if (blast.status !== "draft") {
        throw new Error("Invalid transition: only draft blasts can be submitted");
    }

    const updated = await prisma.emailBlast.update({
        where: { id: blast.id },
        data: { status: "pending_approval" },
        include: { recipients: true },
    });

    return toBlastDto(updated as BlastWithRecipients);
}

export async function approveEmailBlast(blastId: string, user: User): Promise<DbEmailBlast> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);
    ensureManager(user);

    if (blast.status !== "pending_approval") {
        throw new Error("Invalid transition: only pending blasts can be approved");
    }

    const updated = await prisma.emailBlast.update({
        where: { id: blast.id },
        data: { status: "approved", approvedBy: user.id, rejectedBy: null, rejectionReason: null },
        include: { recipients: true },
    });

    return toBlastDto(updated as BlastWithRecipients);
}

export async function rejectEmailBlast(blastId: string, reason: string, user: User): Promise<DbEmailBlast> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);
    ensureManager(user);

    if (blast.status !== "pending_approval") {
        throw new Error("Invalid transition: only pending blasts can be rejected");
    }

    const updated = await prisma.emailBlast.update({
        where: { id: blast.id },
        data: { status: "rejected", rejectedBy: user.id, rejectionReason: reason },
        include: { recipients: true },
    });

    return toBlastDto(updated as BlastWithRecipients);
}

export async function sendEmailBlast(blastId: string, user: User): Promise<DbEmailBlast> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);
    ensureManager(user);

    if (blast.status !== "approved") {
        throw new Error("Invalid transition: only approved blasts can be sent");
    }

    const updated = await prisma.emailBlast.update({
        where: { id: blast.id },
        data: { status: "sent", sentAt: new Date(), sentCount: blast.recipients.length },
        include: { recipients: true },
    });

    return toBlastDto(updated as BlastWithRecipients);
}

export async function getSendPayload(blastId: string, user: User): Promise<{
    subject: string;
    body: string;
    contentMode: "text" | "html";
    recipients: string[];
    senderName?: string;
    senderEmail?: string;
    replyToEmail?: string;
    attachments: Array<{ filename: string; mimeType: string; storageKey: string }>;
}> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);
    ensureManager(user);

    if (blast.status !== "approved") {
        throw new Error("Invalid transition: only approved blasts can be sent");
    }

    const attachments = await prisma.emailBlastAttachment.findMany({
        where: { blastId: blast.id },
        orderBy: { createdAt: "asc" },
    });

    return {
        subject: blast.subject,
        body: blast.body,
        contentMode: blast.contentMode as "text" | "html",
        recipients: blast.recipients.map((r) => r.email),
        senderName: blast.senderName ?? undefined,
        senderEmail: blast.senderEmail ?? undefined,
        replyToEmail: blast.replyToEmail ?? undefined,
        attachments: attachments.map((a) => ({ filename: a.filename, mimeType: a.mimeType, storageKey: a.storageKey })),
    };
}

export async function archiveEmailBlast(blastId: string, user: User): Promise<DbEmailBlast> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);
    ensureManager(user);

    const updated = await prisma.emailBlast.update({
        where: { id: blast.id },
        data: { isArchived: true },
        include: { recipients: true },
    });

    return toBlastDto(updated as BlastWithRecipients);
}

export async function listBlastAttachments(blastId: string, user: User): Promise<DbEmailBlastAttachment[]> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);

    const attachments = await prisma.emailBlastAttachment.findMany({
        where: { blastId: blast.id },
        orderBy: { createdAt: "desc" },
    });

    return attachments.map((a) => toAttachmentDto(a as BlastAttachmentRecord));
}

export async function addBlastAttachment(
    blastId: string,
    input: {
        filename: string;
        mimeType: string;
        data: Buffer;
        uploadedBy: string;
        publicBaseUrl?: string;
    },
    user: User
): Promise<DbEmailBlastAttachment> {
    validateAttachmentInput(input.filename, input.mimeType, input.data.byteLength);
    const checksumSha256 = createHash("sha256").update(input.data).digest("hex");

    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);
    ensureBlastMutable(blast.status);

    const stats = await getBlastAttachmentStats(blastId);
    if (stats.count >= EMAIL_BLAST_ATTACHMENT_LIMITS.maxFilesPerBlast) {
        throw new Error("Validation failed: maximum 5 attachments are allowed per blast");
    }

    if (stats.totalBytes + input.data.byteLength > EMAIL_BLAST_ATTACHMENT_LIMITS.maxTotalBytes) {
        throw new Error("Payload too large: total attachment size exceeds 20 MB");
    }

    const duplicate = await prisma.emailBlastAttachment.findFirst({
        where: { blastId, checksumSha256 },
        select: { id: true },
    });
    if (duplicate) throw new Error("Validation failed: duplicate attachment detected");

    const stored = await saveUploadForBlast(blastId, input.filename, input.data, input.publicBaseUrl);

    const created = await prisma.emailBlastAttachment.create({
        data: {
            blastId,
            kind: getAttachmentKindFromMime(input.mimeType),
            storageKey: stored.storageKey,
            publicUrl: stored.publicUrl,
            filename: normalizeAttachmentFilename(input.filename),
            mimeType: input.mimeType,
            sizeBytes: stored.sizeBytes,
            checksumSha256,
            uploadedBy: input.uploadedBy,
        },
    });

    return toAttachmentDto(created as BlastAttachmentRecord);
}

export async function deleteBlastAttachment(blastId: string, attachmentId: string, user: User): Promise<void> {
    const blast = await getBlastOrThrow(blastId);
    ensureDepartmentAccess(user, blast.departmentId);
    ensureBlastMutable(blast.status);

    const attachment = await prisma.emailBlastAttachment.findFirst({
        where: { id: attachmentId, blastId },
    });

    if (!attachment) throw new Error("Attachment not found");

    await prisma.emailBlastAttachment.delete({ where: { id: attachment.id } });
    await deleteStoredFile(attachment.storageKey);
}
