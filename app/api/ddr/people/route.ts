import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/ddr/people
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const type = req.nextUrl.searchParams.get("type"); // ?type=Mentor

    const people = await prisma.ddrPerson.findMany({
      where: {
        departmentId: session.departmentId,
        ...(type && { type }),
      },
      orderBy: { name: "asc" },
    });

    return ok(people);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/ddr/people — manager/head only
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return unauthorized();

    const body = await req.json();
    const { type, name, role, contactInfo, currentDivision, internalRole, previousDivision, curriculumRef } = body;

    if (!type || !name || !role || !currentDivision) {
      return badRequest("type, name, role, and currentDivision are required");
    }

    const person = await prisma.ddrPerson.create({
      data: {
        type, name, role, contactInfo, currentDivision,
        internalRole, previousDivision, curriculumRef,
        departmentId: session.departmentId,
        createdById: session.id,
      },
    });

    return created(person, "Person added to DDR");
  } catch (e) {
    return serverError(e);
  }
}
