import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, forbidden, serverError, badRequest, notFound, noContent } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/tasks/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const task = await prisma.task.findUnique({
      where: { id: id },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        attachments: true,
        links: true,
      },
    });

    if (!task) return notFound("Task");
    if (task.departmentId !== session.departmentId) return forbidden();

    return ok(task);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/tasks/[id] — managers can update any field; assignee can only update progress
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const task = await prisma.task.findUnique({ where: { id: id } });
    if (!task) return notFound("Task");
    if (task.departmentId !== session.departmentId) return forbidden();

    const body = await req.json();
    const canManage = isManagerOrAbove(session);

    // Managers/chiefs can update any field on any dept task.
    // Associates can update status + progress on any dept task (needed for Kanban drag),
    // but cannot change titles, assignees, dates etc.
    const allowedFields = canManage
      ? ["title", "description", "status", "progressPercentage", "assigneeId", "dueDate", "startDate", "dependencies", "division"]
      : ["status", "progressPercentage"];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        if (field === "dueDate" || field === "startDate") {
          data[field] = body[field] ? new Date(body[field]) : null;
        } else {
          data[field] = body[field];
        }
      }
    }

    if (Object.keys(data).length === 0) return badRequest("No valid fields to update");

    const updated = await prisma.task.update({
      where: { id: id },
      data,
      include: { assignee: { select: { id: true, name: true, avatar: true } }, attachments: true },
    });

    return ok(updated, "Task updated");
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/tasks/[id] — manager/head only
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden("Only managers and above can delete tasks");

    const task = await prisma.task.findUnique({ where: { id: id } });
    if (!task) return notFound("Task");
    if (task.departmentId !== session.departmentId) return forbidden();

    await prisma.task.delete({ where: { id: id } });

    return noContent();
  } catch (e) {
    return serverError(e);
  }
}
