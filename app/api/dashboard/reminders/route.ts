import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/dashboard/reminders
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const reminders = await prisma.reminder.findMany({
      where: { departmentId: session.departmentId },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return ok(reminders);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/dashboard/reminders — manager/head only
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return unauthorized();

    const body = await req.json();
    const { type, title, message, link } = body;

    if (!type || !title) return badRequest("type and title are required");

    const reminder = await prisma.reminder.create({
      data: { type, title, message: message ?? "", link: link || null, departmentId: session.departmentId, createdById: session.id },
      include: { createdBy: { select: { id: true, name: true } } },
    });

    return created(reminder, "Reminder posted");
  } catch (e) {
    return serverError(e);
  }
}
