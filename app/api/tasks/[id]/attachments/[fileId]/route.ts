import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { unauthorized, forbidden, serverError, notFound, noContent } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// DELETE /api/tasks/[id]/attachments/[fileId]
export async function DELETE(
  req: NextRequest, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  const { id, fileId } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden("Only managers can remove attachments");

    const attachment = await prisma.attachment.findUnique({ where: { id: fileId } });
    if (!attachment || attachment.taskId !== id) return notFound("Attachment");

    await prisma.attachment.delete({ where: { id: fileId } });

    return noContent();
  } catch (e) {
    return serverError(e);
  }
}
