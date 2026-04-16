import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/api-helpers";
import { getSession } from "@/lib/api-helpers";

// GET /api/dashboard/okrs — returns the OKRs for the current user's department
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const dept = await (prisma as any).department.findUnique({
      where: { id: session.departmentId },
      select: { id: true, name: true, okrs: true },
    });

    return ok({ okrs: (dept?.okrs as any[]) ?? [], departmentName: dept?.name ?? "" });
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/dashboard/okrs — saves OKRs for the current user's department
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { okrs } = await req.json();

    await (prisma as any).department.update({
      where: { id: session.departmentId },
      data: { okrs: okrs ?? [] },
    });

    return ok({ ok: true }, "OKRs saved");
  } catch (e) {
    return serverError(e);
  }
}
