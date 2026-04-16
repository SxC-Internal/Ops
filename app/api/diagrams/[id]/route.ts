import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, forbidden, serverError, badRequest, notFound, noContent } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/diagrams/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getSession(req);
        if (!session) return unauthorized();

        const diagram = await prisma.diagram.findUnique({
            where: { id },
            include: { createdBy: { select: { id: true, name: true, avatar: true, email: true } } },
        });

        if (!diagram) return notFound("Diagram");
        if (diagram.departmentId !== session.departmentId) return forbidden();

        return ok(diagram);
    } catch (e) {
        return serverError(e);
    }
}

// PATCH /api/diagrams/[id] — save board state (title, nodes, connections)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getSession(req);
        if (!session) return unauthorized();

        const diagram = await prisma.diagram.findUnique({ where: { id } });
        if (!diagram) return notFound("Diagram");
        if (diagram.departmentId !== session.departmentId) return forbidden();

        const body = await req.json();
        const { title, nodes, connections } = body;

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (nodes !== undefined) updateData.nodes = nodes;
        if (connections !== undefined) updateData.connections = connections;

        if (Object.keys(updateData).length === 0) return badRequest("No fields to update");

        const updated = await prisma.diagram.update({
            where: { id },
            data: updateData,
            include: { createdBy: { select: { id: true, name: true, avatar: true } } },
        });

        return ok(updated, "Diagram saved");
    } catch (e) {
        return serverError(e);
    }
}

// DELETE /api/diagrams/[id] — anyone in the dept can delete (or restrict to manager if needed)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getSession(req);
        if (!session) return unauthorized();

        const diagram = await prisma.diagram.findUnique({ where: { id } });
        if (!diagram) return notFound("Diagram");
        if (diagram.departmentId !== session.departmentId) return forbidden();

        await prisma.diagram.delete({ where: { id } });

        return noContent();
    } catch (e) {
        return serverError(e);
    }
}
