import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, forbidden, serverError, badRequest, notFound, noContent } from "@/lib/api-helpers";
import { getSession } from "@/lib/api-helpers";

// POST /api/tasks/[id]/attachments — assignee can upload PNG or PDF
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const task = await prisma.task.findUnique({ where: { id: id } });
    if (!task) return notFound("Task");
    if (task.assigneeId !== session.id) {
      return forbidden("Only the task assignee can add attachments");
    }

    const body = await req.json();
    const { name, url, type } = body;

    if (!name || !url || !type) return badRequest("name, url, and type are required");
    if (!["application/pdf", "image/png"].includes(type)) {
      return badRequest("Only PDF and PNG files are allowed");
    }

    const attachment = await prisma.attachment.create({
      data: { taskId: id, name, url, type },
    });

    return created(attachment, "Attachment added");
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/tasks/[id]/attachments/[fileId] is handled in the sub-route
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const attachments = await prisma.attachment.findMany({ where: { taskId: id } });
    return ok(attachments);
  } catch (e) {
    return serverError(e);
  }
}
