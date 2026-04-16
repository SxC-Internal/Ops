import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { unauthorized, serverError, notFound, noContent, forbidden } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// DELETE /api/dashboard/links/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const link = await prisma.quickLink.findUnique({ where: { id: id } });
    if (!link) return notFound("Quick link");

    const isCreator = link.createdById === session.id;
    if (!isCreator && !isManagerOrAbove(session)) return forbidden();

    await prisma.quickLink.delete({ where: { id: id } });
    return noContent();
  } catch (e) {
    return serverError(e);
  }
}
