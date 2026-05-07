import { NextRequest } from "next/server";
import {
    createBlastSchema,
    createEmailBlast,
    listEmailBlasts,
} from "@/lib/server/email-blast-service";
import {
    apiError,
    apiSuccess,
    getPublicErrorMessage,
    mapServiceErrorToStatus,
} from "@/lib/server/http";
import { getRequestUser, RequestAuthError } from "@/lib/server/request-user";

export async function GET(request: NextRequest) {
    try {
        const user = await getRequestUser();
        const { searchParams } = new URL(request.url);
        const departmentId = searchParams.get("departmentId") ?? user.departmentId ?? "";
        const data = await listEmailBlasts(departmentId, user);
        return apiSuccess(data);
    } catch (error) {
        if (error instanceof RequestAuthError) {
            return apiError(error.message, error.statusCode);
        }

        const status = mapServiceErrorToStatus(error);
        return apiError(getPublicErrorMessage(error, status, "Failed to list email blasts"), status);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getRequestUser();
        const body = await request.json();
        const parsed = createBlastSchema.safeParse(body);

        if (!parsed.success) {
            return apiError(parsed.error.issues.map((i) => i.message).join("; "), 422);
        }

        const blast = await createEmailBlast(parsed.data, user);
        return apiSuccess(blast, 201);
    } catch (error) {
        if (error instanceof RequestAuthError) {
            return apiError(error.message, error.statusCode);
        }

        const status = mapServiceErrorToStatus(error);
        return apiError(getPublicErrorMessage(error, status, "Failed to create email blast"), status);
    }
}
