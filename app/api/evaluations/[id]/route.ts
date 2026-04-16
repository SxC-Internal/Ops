import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, forbidden, serverError, notFound, noContent } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// PATCH /api/evaluations/[id] — manager/head, form must still be open
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden("Only managers or above can edit evaluations");

    const ev = await prisma.evaluation.findUnique({ where: { id } });
    if (!ev) return notFound("Evaluation");
    if (ev.targetDeptId !== session.departmentId) return forbidden();

    if (new Date((ev as any).deadline) < new Date()) {
      return forbidden("Cannot edit a closed evaluation");
    }

    const body = await req.json();
    const { title, deadline, targetRoles, questions } = body;

    // If questions are being updated, clear all existing responses first
    let responsesCleared = 0;
    if (questions !== undefined) {
      const deleted = await prisma.evalResponse.deleteMany({
        where: { evaluationId: id },
      });
      responsesCleared = deleted.count;

      // Auto-post a reminder notification so everyone sees "form updated, re-fill required"
      if (responsesCleared > 0) {
        await prisma.reminder.create({
          data: {
            type: "warning",
            title: `Form Updated: "${title ?? ev.title}"`,
            message: "This evaluation form has been updated. Any previous submissions have been cleared — please re-submit your response.",
            departmentId: session.departmentId,
            createdById: session.id,
          },
        });
      }
    }

    const updated = await prisma.evaluation.update({
      where: { id },
      data: {
        ...(title      !== undefined && { title }),
        ...(deadline   !== undefined && { deadline: new Date(deadline) }),
        ...(targetRoles !== undefined && { targetRoles }),
        ...(questions  !== undefined && { questions }),
      },
    });

    return ok({ ...updated, responsesCleared });
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/evaluations/[id] — manager/head only, form must still be open
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden("Only managers or above can delete evaluations");

    const ev = await prisma.evaluation.findUnique({ where: { id } });
    if (!ev) return notFound("Evaluation");
    if (ev.targetDeptId !== session.departmentId) return forbidden();

    if (new Date((ev as any).deadline) < new Date()) {
      return forbidden("Cannot delete a closed evaluation");
    }

    await prisma.evaluation.delete({ where: { id } });

    return noContent();
  } catch (e) {
    return serverError(e);
  }
}
