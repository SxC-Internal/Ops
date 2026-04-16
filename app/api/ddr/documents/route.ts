import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/ddr/documents
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const docs = await prisma.ddrDocument.findMany({
      where: { departmentId: session.departmentId },
      orderBy: { createdAt: "desc" },
    });

    return ok(docs);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/ddr/documents — manager/head only
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return unauthorized();

    const body = await req.json();
    const { type, documentType, title, status, lastModified, owner } = body;

    if (!documentType || !title) return badRequest("documentType and title are required");

    const doc = await prisma.ddrDocument.create({
      data: {
        type: type ?? "Draft",
        documentType,
        title,
        status: status ?? "Draft",
        lastModified: lastModified ?? new Date().toISOString().split("T")[0],
        owner: owner ?? session.name,
        departmentId: session.departmentId,
        createdById: session.id,
      },
    });

    return created(doc, "Document registered");
  } catch (e) {
    return serverError(e);
  }
}
