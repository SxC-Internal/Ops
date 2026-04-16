import { NextRequest, NextResponse } from "next/server";

// ─── Standard response helpers ────────────────────────────────────────────────

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ data, message }, { status });
}

export function created<T>(data: T, message = "Created") {
  return NextResponse.json({ data, message }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden(msg = "Forbidden") {
  return NextResponse.json({ error: msg }, { status: 403 });
}

export function notFound(resource = "Resource") {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

export function serverError(err: unknown) {
  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

// ─── Auth session helper (stub — wire Better Auth here later) ─────────────────

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;         // dept slug: "ops" | "finance" | admin
  membershipRole: string; // "head" | "manager" | "member"
  departmentId: string;
}

/**
 * TODO: Replace this stub with real Better Auth session lookup.
 * For now, reads a custom header `x-user-id` that the frontend can send
 * (dev only—remove before production).
 *
 * In production this will be:
 *   const session = await auth.api.getSession({ headers: req.headers });
 *   if (!session) return null;
 *   return mapDbUserToSession(session.user);
 */
export async function getSession(req: NextRequest): Promise<SessionUser | null> {
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return null;

    const { prisma } = await import("@/lib/db");
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { memberships: { include: { department: true } } },
    });

    if (!user || !user.isActive) return null;

    const membership = user.memberships[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: membership?.department.slug ?? "ops",
      membershipRole: (membership?.role as "head" | "manager" | "member") ?? "member",
      departmentId: membership?.departmentId ?? "",
    };
  } catch {
    return null;
  }
}

// ─── Role guards ─────────────────────────────────────────────────────────────

export function isManagerOrAbove(session: SessionUser) {
  return session.membershipRole === "head" || session.membershipRole === "manager";
}

export function isHead(session: SessionUser) {
  return session.membershipRole === "head";
}
