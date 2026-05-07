import type { User } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export class RequestAuthError extends Error {
    readonly statusCode: number;

    constructor(message: string, statusCode = 401) {
        super(message);
        this.statusCode = statusCode;
    }
}

export async function getRequestUser(): Promise<User> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.email) {
        throw new RequestAuthError("Missing authentication context", 401);
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            memberships: {
                include: { department: true },
            },
        },
    });

    if (!dbUser || !dbUser.isActive) {
        throw new RequestAuthError("User not authorized. Please contact an administrator.", 403);
    }

    const membership = dbUser.memberships[0];
    const role = (membership?.department.slug ?? "ops") as User["role"];

    return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role,
        avatar: dbUser.avatar ?? undefined,
        departmentId: membership?.departmentId,
        membershipRole: (membership?.role as User["membershipRole"]) ?? "member",
    };
}
