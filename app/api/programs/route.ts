import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/programs — filterable by ?batch= or ?status=
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const batch = req.nextUrl.searchParams.get("batch");
    const status = req.nextUrl.searchParams.get("status");

    const programs = await prisma.program.findMany({
      where: {
        ...(batch && { batch }),
        ...(status && { status }),
      },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { startDate: "desc" },
    });

    return ok(programs);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/programs — manager/head only
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return unauthorized();

    const body = await req.json();
    const { title, batch, status, participants, mentors, location, description, date, startDate, endDate, progress, team } = body;

    if (!title || !batch || !date || !startDate || !endDate) {
      return badRequest("title, batch, date, startDate, and endDate are required");
    }

    const program = await prisma.program.create({
      data: {
        title, batch,
        status: status ?? "Upcoming",
        participants: participants ?? 0,
        mentors: mentors ?? 0,
        location, description,
        date, startDate, endDate,
        progress: progress ?? 0,
        team: team ?? [],
        departmentId: session.departmentId,
        createdById: session.id,
      },
    });

    return created(program, "Program created");
  } catch (e) {
    return serverError(e);
  }
}
