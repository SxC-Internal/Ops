import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, created, unauthorized, serverError, badRequest } from "@/lib/api-helpers";
import { getSession, isManagerOrAbove } from "@/lib/api-helpers";

// GET /api/ddr/reports
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const reports = await prisma.ddrReport.findMany({
      where: { departmentId: session.departmentId },
      orderBy: { createdAt: "desc" },
    });

    return ok(reports);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/ddr/reports — manager/head only
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();
    if (!isManagerOrAbove(session)) return unauthorized();

    const body = await req.json();
    const { title, type, date, summary, percentage } = body;

    if (!title || !type || !date) return badRequest("title, type, and date are required");

    const report = await prisma.ddrReport.create({
      data: {
        title, type, date,
        summary: summary ?? null,
        percentage: percentage ?? null,
        departmentId: session.departmentId,
        createdById: session.id,
      },
    });

    return created(report, "Report logged");
  } catch (e) {
    return serverError(e);
  }
}
