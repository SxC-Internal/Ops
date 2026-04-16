import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, serverError, badRequest, created } from "@/lib/api-helpers";
import { getSession, isHead } from "@/lib/api-helpers";

// GET /api/users — all users (admin only, or filter ?dept=ops)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const dept = req.nextUrl.searchParams.get("dept");

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        ...(dept && {
          memberships: { some: { department: { slug: dept } } },
        }),
      },
      include: {
        memberships: { include: { department: true } },
      },
      orderBy: { name: "asc" },
    });

    const shaped = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      memberships: u.memberships.map((m) => ({
        role: m.role,
        department: { id: m.department.id, slug: m.department.slug, name: m.department.name },
      })),
    }));

    return ok(shaped);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/users — create user (head/admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isHead(session) && session.role !== "admin") {
      return unauthorized();
    }

    const body = await req.json();
    const { name, email, password, departmentId, role } = body;

    if (!name || !email || !password || !departmentId || !role) {
      return badRequest("name, email, password, departmentId, and role are required");
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password, // TODO: hash with bcrypt when auth is wired
        memberships: {
          create: { departmentId, role },
        },
      },
      include: { memberships: { include: { department: true } } },
    });

    return created({ id: user.id, name: user.name, email: user.email });
  } catch (e: any) {
    if (e?.code === "P2002") return badRequest("Email already exists");
    return serverError(e);
  }
}
