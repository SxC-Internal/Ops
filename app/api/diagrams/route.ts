import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession } from "@/lib/api-helpers";

// GET /api/diagrams — all diagrams for user's department
export async function GET(req: NextRequest) {
    try {
        const session = await getSession(req);
        if (!session) return unauthorized();

        const diagrams = await prisma.diagram.findMany({
            where: { departmentId: session.departmentId },
            orderBy: { updatedAt: "desc" },
            include: {
                createdBy: { select: { id: true, name: true, avatar: true, email: true } },
            },
        });

        return ok(diagrams);
    } catch (e) {
        return serverError(e);
    }
}

// POST /api/diagrams — create a new blank or templated diagram
export async function POST(req: NextRequest) {
    try {
        const session = await getSession(req);
        if (!session) return unauthorized();

        const body = await req.json();
        const { title, nodes, connections } = body;

        if (!title) return badRequest("Title is required");

        const diagram = await prisma.diagram.create({
            data: {
                title,
                nodes: nodes ?? [],
                connections: connections ?? [],
                departmentId: session.departmentId,
                createdById: session.id,
            },
            include: {
                createdBy: { select: { id: true, name: true, avatar: true, email: true } },
            },
        });

        return created(diagram, "Diagram created");
    } catch (e) {
        return serverError(e);
    }
}
