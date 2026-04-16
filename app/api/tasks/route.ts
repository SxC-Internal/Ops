import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/tasks — tasks in user's dept, filter ?assigneeId=me
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const assigneeFilter = req.nextUrl.searchParams.get("assigneeId");

    const tasks = await prisma.task.findMany({
      where: {
        departmentId: session.departmentId,
        ...(assigneeFilter === "me" && { assigneeId: session.id }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        attachments: true,
        links: true,
      },
      orderBy: { dueDate: "asc" },
    });

    return ok(tasks);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/tasks — create task (manager/head only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return unauthorized();

    const body = await req.json();
    const { title, assigneeId, dueDate, startDate, description, division, dependencies, links } = body;

    if (!title || !dueDate) return badRequest("title and dueDate are required");

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        dueDate: new Date(dueDate),
        startDate: startDate ? new Date(startDate) : null,
        division: division ?? session.role,
        assigneeId: assigneeId ?? null,
        departmentId: session.departmentId,
        dependencies: dependencies ?? [],
        links: links?.length
          ? { create: links.map((l: { label: string; url: string }) => ({ label: l.label, url: l.url })) }
          : undefined,
      },
      include: { assignee: { select: { id: true, name: true, avatar: true } }, links: true },
    });

    return created(task, "Task created");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
