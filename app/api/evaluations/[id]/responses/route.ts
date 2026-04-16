import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, forbidden, serverError, badRequest, notFound } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/evaluations/[id]/responses — all responses + pending list (manager/head only)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden();

    const ev = await prisma.evaluation.findUnique({
      where: { id },
      include: { responses: { include: { respondent: { select: { id: true, name: true, email: true } } } } },
    });
    if (!ev) return notFound("Evaluation");

    // Build list of who HASN'T responded
    const targetRoles: string[] = ((ev as any).targetRoles ?? "all")
      .split(",")
      .map((r: string) => r.trim());

    const memberships = await prisma.userDepartment.findMany({
      where: {
        departmentId: ev.targetDeptId,
        ...(targetRoles.includes("all") ? {} : { role: { in: targetRoles } }),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    const respondedIds = new Set(ev.responses.map((r: any) => r.userId));
    const pending = memberships
      .map((m: any) => m.user)
      .filter((u: any) => !respondedIds.has(u.id));

    return ok({ questions: ev.questions, responses: ev.responses, pending });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/evaluations/[id]/responses — submit own response (any member)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const ev = await prisma.evaluation.findUnique({ where: { id } });
    if (!ev) return notFound("Evaluation");
    if (ev.targetDeptId !== session.departmentId) return forbidden();
    if (new Date() > ev.deadline) return badRequest("This evaluation deadline has passed");

    const body = await req.json();
    if (!body.answers?.length) return badRequest("answers are required");

    try {
      const response = await prisma.evalResponse.create({
        data: { evaluationId: id, userId: session.id, answers: body.answers },
      });
      return created(response, "Response submitted");
    } catch (e: any) {
      if (e?.code === "P2002") return badRequest("You have already submitted this form");
      throw e;
    }
  } catch (e) {
    return serverError(e);
  }
}
