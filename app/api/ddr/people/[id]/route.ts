import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, forbidden, serverError, badRequest, notFound, noContent } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove, isHead } from "@/lib/api-helpers";

// PATCH /api/ddr/people/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return forbidden();

    const person = await prisma.ddrPerson.findUnique({ where: { id: id } });
    if (!person) return notFound("Person");
    if (person.departmentId !== session.departmentId) return forbidden();

    const body = await req.json();
    const updated = await prisma.ddrPerson.update({ where: { id: id }, data: body });

    return ok(updated, "Person updated");
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/ddr/people/[id] — head only
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isHead(session)) return forbidden("Only the department head can delete DDR entries");

    const person = await prisma.ddrPerson.findUnique({ where: { id: id } });
    if (!person) return notFound("Person");
    if (person.departmentId !== session.departmentId) return forbidden();

    await prisma.ddrPerson.delete({ where: { id: id } });
    return noContent();
  } catch (e) {
    return serverError(e);
  }
}
