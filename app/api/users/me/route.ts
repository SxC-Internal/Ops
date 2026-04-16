import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession } from "@/lib/api-helpers";

// GET /api/users/me
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        memberships: { include: { department: true } },
      },
    });

    if (!user) return unauthorized();

    const membership = user.memberships[0];

    return ok({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      department: membership
        ? { id: membership.department.id, slug: membership.department.slug, name: membership.department.name }
        : null,
      membershipRole: membership?.role ?? null,
    });
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/users/me — update own name/avatar
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const { name, avatar } = body;

    if (!name && !avatar) return badRequest("Provide at least one field to update");

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: { ...(name && { name }), ...(avatar && { avatar }) },
    });

    return ok({ id: updated.id, name: updated.name, avatar: updated.avatar });
  } catch (e) {
    return serverError(e);
  }
}
