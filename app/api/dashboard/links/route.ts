import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/dashboard/links
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const links = await prisma.quickLink.findMany({
      where: { departmentId: session.departmentId },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return ok(links);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/dashboard/links — manager/head only
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return unauthorized();

    const body = await req.json();
    const { title, subtitle, type, url, meetingId } = body;

    if (!title || !type) return badRequest("title and type are required");

    const link = await prisma.quickLink.create({
      data: { title, subtitle, type, url, meetingId, departmentId: session.departmentId, createdById: session.id },
      include: { createdBy: { select: { id: true, name: true } } },
    });

    return created(link, "Quick link added");
  } catch (e) {
    return serverError(e);
  }
}
