import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";

// ─── Approved email whitelist ──────────────────────────────────────────────────
export const APPROVED_EMAILS: Record<string, "head" | "manager" | "member"> = {
    // Admin / Developer
    "timanuel276@gmail.com": "head",
    // Chief
    "darrelldamareka@gmail.com": "head",
    // Managers
    "rendysitepu1510@gmail.com": "manager",
    "najmadhia740@gmail.com": "manager",
    "ftmhjazzl3@gmail.com": "manager",
    // Associates
    "ilyasakusnadi014@gmail.com": "member",
    "bulankyg@gmail.com": "member",
    "elisabethmichelle279@gmail.com": "member",
    "ivanderathala@gmail.com": "member",
    "novfrialitasuhardani@gmail.com": "member",
    "panglimaanas@gmail.com": "member",
    "naurazka.aragani@gmail.com": "member",
    "kalyasalsabilaarizya@gmail.com": "member",
    "jesslein.205240055@stu.untar.ac.id": "member",
    "srirahayu.niaga@gmail.com": "member",
    "nisyasyahwa@gmail.com": "member",
    "yeshatriyanaa@gmail.com": "member",
    // Dummy / test accounts
    "timothyimanuel2@gmail.com": "member",
};

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    // Auto-provision the user in our DB on first Google sign-in
    // and block anyone not on the approved list
    databaseHooks: {
        user: {
            create: {
                before: async (userData) => {
                    const email = (userData.email ?? "").toLowerCase();
                    const role = APPROVED_EMAILS[email];
                    if (!role) {
                        throw new Error("UNAUTHORIZED_EMAIL");
                    }
                    return { data: userData };
                },
                after: async (user) => {
                    const email = (user.email ?? "").toLowerCase();
                    const role = APPROVED_EMAILS[email];
                    if (!role) return;

                    const dept = await prisma.department.findFirst({ where: { slug: "ops" } });
                    if (!dept) return;

                    // Make sure our User table row exists with our schema
                    const existing = await prisma.user.findUnique({ where: { email } });
                    if (!existing) {
                        await prisma.user.create({
                            data: {
                                id: user.id,
                                name: user.name ?? email,
                                email,
                                password: "",
                                avatar: user.image ?? null,
                            },
                        });
                    }

                    // Create membership if not already there
                    const hasMembership = await prisma.userDepartment.findFirst({
                        where: { userId: user.id, departmentId: dept.id },
                    });
                    if (!hasMembership) {
                        await prisma.userDepartment.create({
                            data: { userId: user.id, departmentId: dept.id, role },
                        });
                    }
                },
            },
        },
    },
});
