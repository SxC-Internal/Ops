import type { User, DbEmailBlast, DbEmailBlastRecipient } from "@/types";

export function isOpsManager(user: User): boolean {
    return user.role === "admin" || user.membershipRole === "manager" || user.membershipRole === "head";
}

export function getOpsRole(user: User): "manager" | "associate" | null {
    if (isOpsManager(user)) return "manager";
    if (user.membershipRole === "member") return "associate";
    return null;
}

export function getEmailBlasts(
    departmentId: string,
    blasts: DbEmailBlast[]
): DbEmailBlast[] {
    return blasts
        .filter((b) => b.departmentId === departmentId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPendingBlasts(blasts: DbEmailBlast[]): DbEmailBlast[] {
    return blasts.filter((b) => b.status === "pending_approval");
}

export function getSentBlasts(blasts: DbEmailBlast[]): DbEmailBlast[] {
    return blasts.filter((b) => b.status === "sent");
}

export function getRecipientsForBlast(
    blastId: string,
    recipients: DbEmailBlastRecipient[]
): DbEmailBlastRecipient[] {
    return recipients.filter((r) => r.blastId === blastId);
}

export function validateEmailList(emails: string[]): {
    valid: string[];
    invalid: string[];
} {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid: string[] = [];
    const invalid: string[] = [];
    for (const email of emails) {
        if (emailRegex.test(email.trim())) {
            valid.push(email.trim());
        } else {
            invalid.push(email.trim());
        }
    }
    return { valid, invalid };
}
