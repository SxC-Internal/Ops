/**
 * Seed script — migrates all mock data from constants.ts / pm-mock-data.ts into the DB.
 * Run with: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import { DB_USERS, DB_DEPARTMENTS, DB_USER_DEPARTMENTS } from "../constants";
import { PM_TASKS, PM_USERS, DDR_PEOPLE, DDR_DOCUMENTS, DDR_REPORTS } from "../data/pm-mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Departments ────────────────────────────────────────────────────────────
  console.log("  → Departments");
  const deptMap: Record<string, string> = {}; // slug → db id

  for (const dept of DB_DEPARTMENTS) {
    const created = await prisma.department.upsert({
      where: { slug: dept.slug },
      update: { name: dept.name },
      create: { id: dept.id, name: dept.name, slug: dept.slug },
    });
    deptMap[dept.slug] = created.id;
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log("  → Users");
  const userMap: Record<string, string> = {}; // old id → db id

  for (const u of DB_USERS) {
    const created = await prisma.user.upsert({
      where: { email: u.email.toLowerCase() },
      update: { name: u.name, isActive: u.isActive },
      create: {
        id: u.id,
        name: u.name,
        email: u.email.toLowerCase(),
        password: u.password,
        isActive: u.isActive,
      },
    });
    userMap[u.id] = created.id;
  }

  // ── User ↔ Department memberships ─────────────────────────────────────────
  console.log("  → Memberships");
  for (const ud of DB_USER_DEPARTMENTS) {
    const userId = userMap[ud.userId];
    const dept = DB_DEPARTMENTS.find((d) => d.id === ud.departmentId);
    if (!userId || !dept) continue;
    const departmentId = deptMap[dept.slug];

    await prisma.userDepartment.upsert({
      where: { userId_departmentId: { userId, departmentId } },
      update: { role: ud.role },
      create: { userId, departmentId, role: ud.role },
    });
  }

  // ── PM Tasks ───────────────────────────────────────────────────────────────
  console.log("  → Tasks");

  // Find the ops department id
  const opsDept = await prisma.department.findUnique({ where: { slug: "ops" } });

  if (opsDept) {
    // Build a PM user id → DB user id map via email
    const pmUserEmailMap: Record<string, string> = {};
    for (const pmUser of PM_USERS) {
      const dbUser = await prisma.user.findUnique({ where: { email: pmUser.email.toLowerCase() } });
      if (dbUser) pmUserEmailMap[pmUser.id] = dbUser.id;
    }

    for (const task of PM_TASKS) {
      const assigneeDbId = task.assigneeId ? pmUserEmailMap[task.assigneeId] : null;

      await prisma.task.upsert({
        where: { id: task.id },
        update: {},
        create: {
          id: task.id,
          title: task.title,
          description: task.description ?? null,
          status: task.status,
          progressPercentage: task.progressPercentage,
          dueDate: new Date(task.dueDate),
          startDate: task.startDate ? new Date(task.startDate) : null,
          division: task.division,
          assigneeId: assigneeDbId ?? null,
          departmentId: opsDept.id,
          dependencies: task.dependencies ?? [],
        },
      });
    }
  }

  // ── DDR People ─────────────────────────────────────────────────────────────
  console.log("  → DDR People");
  if (opsDept) {
    const opsHead = await prisma.user.findFirst({
      where: {
        memberships: {
          some: { departmentId: opsDept.id, role: "head" },
        },
      },
    });

    if (opsHead) {
      for (const person of DDR_PEOPLE) {
        await prisma.ddrPerson.upsert({
          where: { id: person.id },
          update: {},
          create: {
            id: person.id,
            type: person.type,
            name: person.name,
            role: person.role,
            contactInfo: person.contactInfo ?? null,
            currentDivision: person.currentDivision ?? "Operations",
            previousDivision: person.previousDivision ?? null,
            internalRole: person.internalRole ?? null,
            departmentId: opsDept.id,
            createdById: opsHead.id,
          },
        });
      }

      for (const doc of DDR_DOCUMENTS) {
        await prisma.ddrDocument.upsert({
          where: { id: doc.id },
          update: {},
          create: {
            id: doc.id,
            type: doc.type ?? "Draft",
            documentType: doc.documentType,
            title: doc.title,
            status: doc.status,
            lastModified: doc.lastModified ?? new Date().toISOString(),
            owner: doc.owner ?? "Unknown",
            departmentId: opsDept.id,
            createdById: opsHead.id,
          },
        });
      }

      for (const report of DDR_REPORTS) {
        await prisma.ddrReport.upsert({
          where: { id: report.id },
          update: {},
          create: {
            id: report.id,
            title: report.title,
            type: report.type,
            date: report.date,
            summary: report.summary ?? null,
            percentage: report.percentage ?? null,
            departmentId: opsDept.id,
            createdById: opsHead.id,
          },
        });
      }
    }
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
