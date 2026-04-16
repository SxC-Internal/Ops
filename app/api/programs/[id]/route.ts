import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, forbidden, serverError, notFound, noContent } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// PATCH /api/programs/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden();

    const program = await prisma.program.findUnique({ where: { id: id } });
    if (!program) return notFound("Program");

    const body = await req.json();
    const updated = await prisma.program.update({ where: { id: id }, data: body });

    return ok(updated, "Program updated");
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/programs/[id] — admin only
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (session.role !== "admin") return forbidden("Only admins can delete programs");

    const program = await prisma.program.findUnique({ where: { id: id } });
    if (!program) return notFound("Program");

    await prisma.program.delete({ where: { id: id } });
    return noContent();
  } catch (e) {
    return serverError(e);
  }
}
