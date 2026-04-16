import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/api-helpers";
import { getSession } from "@/lib/api-helpers";

// GET /api/evaluations/active — forms open for the current member to fill
// Filters by targetRoles matching the user's membershipRole
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const now = new Date();
    const userRole = session.membershipRole; // "head" | "manager" | "member"

    // Find evaluations targeting member's dept that haven't passed deadline
    // and member hasn't responded to yet
    const evals = await prisma.evaluation.findMany({
      where: {
        targetDeptId: session.departmentId,
        deadline: { gte: now },
        responses: { none: { userId: session.id } },
      },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { deadline: "asc" },
    });

    // Filter client-side by targetRoles
    const filtered = evals.filter((ev: any) => {
      const roles: string[] = (ev.targetRoles ?? "all")
        .split(",")
        .map((r: string) => r.trim());
      return roles.includes("all") || roles.includes(userRole);
    });

    return ok(filtered);
  } catch (e) {
    return serverError(e);
  }
}
