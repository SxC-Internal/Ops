import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, forbidden, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/evaluations — manager/head sees all; member sees nothing here (use /active)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden("Use /api/evaluations/active for your forms");

    const evals = await prisma.evaluation.findMany({
      where: { targetDeptId: session.departmentId },
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(evals);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/evaluations — create form (manager/head only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden();

    const body = await req.json();
    const { title, questions, deadline, targetRoles } = body;

    if (!title || !questions?.length || !deadline) {
      return badRequest("title, questions, and deadline are required");
    }

    // targetRoles: string[] e.g. ["member","manager"] → store as "member,manager"
    const rolesStr = Array.isArray(targetRoles) && targetRoles.length
      ? targetRoles.join(",")
      : "all";

    const evaluation = await prisma.evaluation.create({
      data: {
        title,
        questions,
        deadline: new Date(deadline),
        targetDeptId: session.departmentId,
        targetRoles: rolesStr,
        createdById: session.id,
      },
    });

    return created(evaluation, "Evaluation form created");
  } catch (e) {
    return serverError(e);
  }
}
