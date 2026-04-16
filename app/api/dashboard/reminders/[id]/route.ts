import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { unauthorized, serverError, notFound, noContent, forbidden } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// DELETE /api/dashboard/reminders/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const reminder = await prisma.reminder.findUnique({ where: { id: id } });
    if (!reminder) return notFound("Reminder");

    // Creator or head can delete
    const isCreator = reminder.createdById === session.id;
    if (!isCreator && !isManagerOrAbove(session)) return forbidden();

    await prisma.reminder.delete({ where: { id: id } });
    return noContent();
  } catch (e) {
    return serverError(e);
  }
}
