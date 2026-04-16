import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/api-helpers";
import { getSession } from "@/lib/api-helpers";

// GET /api/evaluations/[id]/responses/me — check if already submitted
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const response = await prisma.evalResponse.findUnique({
      where: { evaluationId_userId: { evaluationId: id, userId: session.id } },
    });

    return ok({ submitted: !!response, response: response ?? null });
  } catch (e) {
    return serverError(e);
  }
}
