import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, serverError, notFound } from "@/lib/api-helpers";
import { getSession, isHead } from "@/lib/api-helpers";

// DELETE /api/users/[id] — deactivate user (head/admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isHead(session) && session.role !== "admin") return unauthorized();

    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) return notFound("User");

    await prisma.user.update({ where: { id: id }, data: { isActive: false } });

    return ok({ id: id }, "User deactivated");
  } catch (e) {
    return serverError(e);
  }
}
