import {
  Program,
  StatMetric,
  Activity,
  Department,
  User,
  TeamMember,
  ReviewItem,
  DbUser,
  DbDepartment,
  DbUserDepartment,
  DbFinanceTransaction,
  DbHrMember,
  DbAnalyticsReport,
  DbMarketingCampaign,
  DbOperationsTask,
} from "./types";

// ---------------------------------------------------------------------------
// Schema-aligned dummy DB tables
// ---------------------------------------------------------------------------

export const DB_DEPARTMENTS: DbDepartment[] = [
  { id: "d_finance", name: "Finance", slug: "finance", createdAt: "2026-01-01T00:00:00Z" },
  { id: "d_ops", name: "Operations", slug: "ops", createdAt: "2026-01-01T00:00:00Z" },
  { id: "d_marketing", name: "Marketing", slug: "marketing", createdAt: "2026-01-01T00:00:00Z" },
  { id: "d_hr", name: "Human Resources", slug: "hr", createdAt: "2026-01-01T00:00:00Z" },
  { id: "d_tech", name: "Data & Tech", slug: "tech", createdAt: "2026-01-01T00:00:00Z" },
];

export const DB_USERS: DbUser[] = [
  // System / Admin
  { id: "u_admin", name: "Administrator", email: "admin@sxc.ac.id", password: "admin", isActive: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },

  // Non-Ops departments (placeholder leads kept for cross-department data)
  { id: "u_fin_head", name: "Finance Lead", email: "finance.lead@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-03T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_hr_head", name: "HR Director", email: "hr.director@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-03T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_mkt_head", name: "Marketing Head", email: "marketing.head@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-03T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_tech_lead", name: "Tech Lead", email: "tech.lead@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-03T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_fin_analyst", name: "Finance Analyst", email: "finance.analyst@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_hr_staff", name: "HR Staff", email: "hr.staff@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_mkt_staff", name: "Marketing Staff", email: "marketing.staff@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_tech_staff", name: "Tech Analyst", email: "tech.analyst@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_fin_staff2", name: "Jessica Alba", email: "jessica.a@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_hr_staff2", name: "Tom Hardy", email: "tom.h@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_mkt_staff2", name: "Zendaya Coleman", email: "zendaya.c@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_tech_staff2", name: "Ada Lovelace", email: "ada.l@sxc.ac.id", password: "password", isActive: true, createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },

  // ── Operations Department ─────────────────────────────────────────────────
  // Chief Operation Officer
  { id: "u_ops_coo", name: "Darrell Damareka",                       email: "darrelldamareka@gmail.com",          password: "password", isActive: true, createdAt: "2026-01-02T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  // General Managers
  { id: "u_ops_gm1", name: "Rendy Putra Bastanta Sitepu",            email: "rendysitepu1510@gmail.com",          password: "password", isActive: true, createdAt: "2026-01-03T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_gm2", name: "Fatimah Janahtun Azzahra",               email: "ftmhjazzl3@gmail.com",               password: "password", isActive: true, createdAt: "2026-01-03T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_gm3", name: "Dhia Najma Shafa Jinan",                 email: "najmadhia740@gmail.com",             password: "password", isActive: true, createdAt: "2026-01-03T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  // Operation Associates
  { id: "u_ops_a1",  name: "Bulan Khayangan",                        email: "bulankyg@gmail.com",                 password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a2",  name: "Novfrialita Karunia Suhardani",           email: "novfrialitasuhardani@gmail.com",     password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a3",  name: "Ilyasa",                                  email: "ilyasakusnadi014@gmail.com",         password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a4",  name: "Kalya Salsabila Arizya",                  email: "kalyasalsabilaarizya@gmail.com",     password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a5",  name: "Anisya Syahwa Fitri",                     email: "nisyasyahwa@gmail.com",              password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a6",  name: "Yesha Trixie",                            email: "yeshatriyanaa@gmail.com",            password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a7",  name: "Sri Rahayu Lestari",                      email: "srirahayu.niaga@gmail.com",          password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a8",  name: "Jesslein Felisha",                        email: "jesslein.205240055@stu.untar.ac.id", password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a9",  name: "Mas Moreno Ivander Athala",               email: "ivanderathala@gmail.com",            password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a10", name: "Mohammad Sang Panglima Anas",             email: "panglimaanas@gmail.com",             password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a11", name: "Elisabeth Michelle",                      email: "elisabethmichelle279@gmail.com",     password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
  { id: "u_ops_a12", name: "Naurazka Salsabila Aragani",              email: "naurazka.aragani@gmail.com",         password: "password", isActive: true, createdAt: "2026-01-08T00:00:00Z", updatedAt: "2026-01-20T00:00:00Z" },
];

export const DB_USER_DEPARTMENTS: DbUserDepartment[] = [
  // Non-Ops departments
  { id: "ud_fin_head",    userId: "u_fin_head",    departmentId: "d_finance",   role: "manager", createdAt: "2026-01-03T00:00:00Z" },
  { id: "ud_hr_head",     userId: "u_hr_head",     departmentId: "d_hr",        role: "head",    createdAt: "2026-01-03T00:00:00Z" },
  { id: "ud_mkt_head",    userId: "u_mkt_head",    departmentId: "d_marketing", role: "head",    createdAt: "2026-01-03T00:00:00Z" },
  { id: "ud_tech_lead",   userId: "u_tech_lead",   departmentId: "d_tech",      role: "head",    createdAt: "2026-01-03T00:00:00Z" },
  { id: "ud_fin_analyst", userId: "u_fin_analyst", departmentId: "d_finance",   role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_hr_staff",    userId: "u_hr_staff",    departmentId: "d_hr",        role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_mkt_staff",   userId: "u_mkt_staff",   departmentId: "d_marketing", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_tech_staff",  userId: "u_tech_staff",  departmentId: "d_tech",      role: "member",  createdAt: "2026-01-08T00:00:00Z" },

  // ── Operations Department ─────────────────────────────────────────────────
  { id: "ud_ops_coo",  userId: "u_ops_coo",  departmentId: "d_ops", role: "head",    createdAt: "2026-01-02T00:00:00Z" },
  { id: "ud_ops_gm1", userId: "u_ops_gm1", departmentId: "d_ops", role: "manager", createdAt: "2026-01-03T00:00:00Z" },
  { id: "ud_ops_gm2", userId: "u_ops_gm2", departmentId: "d_ops", role: "manager", createdAt: "2026-01-03T00:00:00Z" },
  { id: "ud_ops_gm3", userId: "u_ops_gm3", departmentId: "d_ops", role: "manager", createdAt: "2026-01-03T00:00:00Z" },
  { id: "ud_ops_a1",  userId: "u_ops_a1",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a2",  userId: "u_ops_a2",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a3",  userId: "u_ops_a3",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a4",  userId: "u_ops_a4",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a5",  userId: "u_ops_a5",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a6",  userId: "u_ops_a6",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a7",  userId: "u_ops_a7",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a8",  userId: "u_ops_a8",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a9",  userId: "u_ops_a9",  departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a10", userId: "u_ops_a10", departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a11", userId: "u_ops_a11", departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
  { id: "ud_ops_a12", userId: "u_ops_a12", departmentId: "d_ops", role: "member",  createdAt: "2026-01-08T00:00:00Z" },
];

// Finance Batch 13 – StudentsxCEOs Jakarta (May–Aug 2025)
// Income: Rp 36,605,000  |  Expense: Rp 14,084,416  |  Net: Rp 22,520,584
export const DB_FINANCE_TRANSACTIONS: DbFinanceTransaction[] = [
  // ── Sponsorship Income ───────────────────────────────────────────────────
  { id: "ft_b13_001", title: "Sponsorship – Saff n Co. (Share Package)", amount: 8000000, type: "income", transactionDate: "2025-04-20", departmentId: "d_finance", createdBy: "u_fin_head", createdAt: "2025-04-20T09:00:00Z" },
  { id: "ft_b13_002", title: "Sponsorship – Cleo (Learn Package)", amount: 5000000, type: "income", transactionDate: "2025-04-25", departmentId: "d_finance", createdBy: "u_fin_head", createdAt: "2025-04-25T10:00:00Z" },
  { id: "ft_b13_003", title: "Sponsorship – Qpon (Aspire Package)", amount: 2500000, type: "income", transactionDate: "2025-05-01", departmentId: "d_finance", createdBy: "u_fin_analyst", createdAt: "2025-05-01T08:30:00Z" },
  { id: "ft_b13_004", title: "International Summit – Lead Sponsorship", amount: 15000000, type: "income", transactionDate: "2025-07-10", departmentId: "d_finance", createdBy: "u_fin_head", createdAt: "2025-07-10T09:00:00Z" },
  // ── Merchandise Revenue ──────────────────────────────────────────────────
  { id: "ft_b13_005", title: "Merchandise Pre-Order – BoD Internal (Batch 13)", amount: 1905000, type: "income", transactionDate: "2025-05-10", departmentId: "d_finance", createdBy: "u_fin_head", createdAt: "2025-05-10T09:00:00Z" },
  // ── Ticket / Event Revenue ───────────────────────────────────────────────
  { id: "ft_b13_006", title: "SxCareer – Ticket Sales", amount: 3500000, type: "income", transactionDate: "2025-05-22", departmentId: "d_finance", createdBy: "u_fin_analyst", createdAt: "2025-05-22T14:00:00Z" },
  { id: "ft_b13_007", title: "SxConnect – Ticket Sales", amount: 4200000, type: "income", transactionDate: "2025-06-05", departmentId: "d_finance", createdBy: "u_fin_analyst", createdAt: "2025-06-05T14:00:00Z" },
  { id: "ft_b13_008", title: "School of Ideas – Ticket Sales", amount: 2500000, type: "income", transactionDate: "2025-06-20", departmentId: "d_finance", createdBy: "u_fin_analyst", createdAt: "2025-06-20T11:00:00Z" },
  // ── Merchandise Production Cost ───────────────────────────────────────────
  { id: "ft_b13_009", title: "Merchandise HPP – Production & Printing", amount: 1584416, type: "expense", transactionDate: "2025-05-15", departmentId: "d_finance", createdBy: "u_fin_analyst", createdAt: "2025-05-15T10:00:00Z" },
  // ── Event Expenses ────────────────────────────────────────────────────────
  { id: "ft_b13_010", title: "SxCareer – Venue Rental", amount: 3000000, type: "expense", transactionDate: "2025-05-20", departmentId: "d_finance", createdBy: "u_fin_analyst", createdAt: "2025-05-20T10:00:00Z" },
  { id: "ft_b13_011", title: "SxCareer – Catering & F&B", amount: 1500000, type: "expense", transactionDate: "2025-05-21", departmentId: "d_finance", createdBy: "u_fin_head", createdAt: "2025-05-21T11:00:00Z" },
  { id: "ft_b13_012", title: "International Summit – Venue & Logistics", amount: 8000000, type: "expense", transactionDate: "2025-08-01", departmentId: "d_finance", createdBy: "u_fin_head", createdAt: "2025-08-01T10:00:00Z" },
];

export const DB_HR_MEMBERS: DbHrMember[] = [
  { id: "hrm_001", userId: "u_hr_head", position: "HR Director", joinDate: "2025-10-01", status: "active", departmentId: "d_hr", createdAt: "2025-10-01T09:00:00Z" },
  { id: "hrm_002", userId: "u_hr_staff", position: "People Ops", joinDate: "2026-01-07", status: "probation", departmentId: "d_hr", createdAt: "2026-01-07T09:00:00Z" },
  { id: "hrm_003", userId: "u_hr_staff2", position: "Talent Acquisition", joinDate: "2025-11-15", status: "active", departmentId: "d_hr", createdAt: "2025-11-15T09:00:00Z" },
  { id: "hrm_004", userId: "u_fin_analyst", position: "Finance Analyst", joinDate: "2025-08-20", status: "active", departmentId: "d_finance", createdAt: "2025-08-20T09:00:00Z" },
  { id: "hrm_005", userId: "u_mkt_staff2", position: "Content Creator", joinDate: "2026-01-15", status: "probation", departmentId: "d_marketing", createdAt: "2026-01-15T09:00:00Z" },
  { id: "hrm_006", userId: "u_ops_staff2", position: "Logistics Coordinator", joinDate: "2024-05-10", status: "on_leave", departmentId: "d_ops", createdAt: "2024-05-10T09:00:00Z" },
  { id: "hrm_007", userId: "u_tech_staff2", position: "Frontend Developer", joinDate: "2025-02-01", status: "active", departmentId: "d_tech", createdAt: "2025-02-01T09:00:00Z" },
];

export const DB_ANALYTICS_REPORTS: DbAnalyticsReport[] = [
  { id: "ar_001", title: "Weekly Platform Health", fileUrl: "https://example.com/reports/weekly-platform-health.pdf", departmentId: "d_tech", createdBy: "u_tech_lead", createdAt: "2026-01-19T11:00:00Z" },
  { id: "ar_002", title: "Signup Funnel Analysis", fileUrl: "https://example.com/reports/signup-funnel.pdf", departmentId: "d_tech", createdBy: "u_tech_staff", createdAt: "2026-01-23T11:00:00Z" },
  { id: "ar_003", title: "Q4 User Retention Insights", fileUrl: "https://example.com/reports/q4-retention.pdf", departmentId: "d_tech", createdBy: "u_tech_staff2", createdAt: "2026-01-28T09:30:00Z" },
  { id: "ar_004", title: "Server Cost Optimization", fileUrl: "https://example.com/reports/server-costs.pdf", departmentId: "d_tech", createdBy: "u_tech_lead", createdAt: "2026-02-02T14:15:00Z" },
  { id: "ar_005", title: "API Endpoint Latency", fileUrl: "https://example.com/reports/api-latency.pdf", departmentId: "d_tech", createdBy: "u_tech_staff", createdAt: "2026-02-10T16:00:00Z" },
  { id: "ar_006", title: "Monthly Security Audit", fileUrl: "https://example.com/reports/security-audit.pdf", departmentId: "d_tech", createdBy: "u_tech_staff2", createdAt: "2026-02-15T10:00:00Z" },
];

export const DB_MARKETING_CAMPAIGNS: DbMarketingCampaign[] = [
  { id: "mc_001", name: "IG Reels - Batch 14", platform: "Instagram", budget: 1200, startDate: "2026-01-10", endDate: "2026-01-20", departmentId: "d_marketing", createdAt: "2026-01-09T10:00:00Z" },
  { id: "mc_002", name: "LinkedIn CEO Outreach", platform: "LinkedIn", budget: 850, startDate: "2026-01-18", endDate: "2026-02-02", departmentId: "d_marketing", createdAt: "2026-01-18T08:00:00Z" },
  { id: "mc_003", name: "TikTok Student Life Vlog", platform: "TikTok", budget: 500, startDate: "2026-02-01", endDate: "2026-02-14", departmentId: "d_marketing", createdAt: "2026-01-28T11:00:00Z" },
  { id: "mc_004", name: "Twitter / X Tech Thread", platform: "Twitter", budget: 300, startDate: "2026-02-05", endDate: "2026-02-10", departmentId: "d_marketing", createdAt: "2026-02-02T13:30:00Z" },
  { id: "mc_005", name: "YouTube Alumni Interviews", platform: "YouTube", budget: 2500, startDate: "2026-02-15", endDate: "2026-03-15", departmentId: "d_marketing", createdAt: "2026-02-10T09:00:00Z" },
  { id: "mc_006", name: "Facebook Ad Retargeting", platform: "Facebook", budget: 1500, startDate: "2026-02-20", endDate: "2026-03-05", departmentId: "d_marketing", createdAt: "2026-02-18T14:45:00Z" },
];

export const DB_OPERATIONS_TASKS: DbOperationsTask[] = [
  { id: "ot_001", title: "Confirm venue booking", status: "in_progress", deadline: "2026-02-05", assignedTo: "u_ops_mgr", departmentId: "d_ops", createdAt: "2026-01-20T12:00:00Z" },
  { id: "ot_002", title: "Publish event timeline", status: "todo", deadline: "2026-02-08", assignedTo: "u_ops_staff", departmentId: "d_ops", createdAt: "2026-01-21T12:00:00Z" },
  { id: "ot_003", title: "Vendor payment follow-up", status: "blocked", deadline: "2026-02-03", assignedTo: "u_ops_staff", departmentId: "d_ops", createdAt: "2026-01-22T12:00:00Z" },
  { id: "ot_004", title: "Order participant lanyards", status: "done", deadline: "2026-01-30", assignedTo: "u_ops_staff2", departmentId: "d_ops", createdAt: "2026-01-25T09:00:00Z" },
  { id: "ot_005", title: "Draft emergency protocol", status: "todo", deadline: "2026-02-15", assignedTo: "u_ops_mgr", departmentId: "d_ops", createdAt: "2026-02-01T14:30:00Z" },
  { id: "ot_006", title: "Coordinate speaker transport", status: "in_progress", deadline: "2026-02-20", assignedTo: "u_ops_staff", departmentId: "d_ops", createdAt: "2026-02-05T10:15:00Z" },
  { id: "ot_007", title: "Audit storage inventory", status: "blocked", deadline: "2026-02-28", assignedTo: "u_ops_staff2", departmentId: "d_ops", createdAt: "2026-02-10T11:00:00Z" },
  { id: "ot_008", title: "Finalize catering menu", status: "done", deadline: "2026-02-12", assignedTo: "u_ops_mgr", departmentId: "d_ops", createdAt: "2026-02-08T16:00:00Z" },
];

// Mock Users for Authentication
export const USERS: User[] = [
  { id: "1", name: "Administrator", email: "admin@adminsxc.ac.id", role: "admin", avatar: "https://picsum.photos/id/100/100/100" },
  { id: "2", name: "Finance Lead", email: "head@financesxc.ac.id", role: "finance", departmentId: "finance", avatar: "https://picsum.photos/id/101/100/100" },
  { id: "3", name: "Ops Manager", email: "lead@opssxc.ac.id", role: "ops", departmentId: "ops", avatar: "https://picsum.photos/id/102/100/100" },
  { id: "4", name: "Marketing Head", email: "chief@marketingsxc.ac.id", role: "marketing", departmentId: "marketing", avatar: "https://picsum.photos/id/103/100/100" },
  { id: "5", name: "HR Director", email: "director@hrsxc.ac.id", role: "hr", departmentId: "hr", avatar: "https://picsum.photos/id/104/100/100" },
  { id: "6", name: "CTO", email: "cto@techsxc.ac.id", role: "tech", departmentId: "tech", avatar: "https://picsum.photos/id/105/100/100" },
];

export const TEAM_MEMBERS: TeamMember[] = [
  // Finance
  { id: "f1", name: "Alice Chen",      role: "Chief Financial Officer", departmentId: "finance",   email: "alice.c@sxceos.com",  image: "https://picsum.photos/id/201/200/200" },
  { id: "f2", name: "Bob Smith",       role: "Finance Manager",         departmentId: "finance",   email: "bob.s@sxceos.com",    image: "https://picsum.photos/id/202/200/200" },
  { id: "f3", name: "Charlie Kim",     role: "Senior Analyst",          departmentId: "finance",   email: "charlie.k@sxceos.com", image: "https://picsum.photos/id/203/200/200" },
  // Marketing
  { id: "m1", name: "Fiona Gallagher", role: "Chief Marketing Officer", departmentId: "marketing", email: "fiona.g@sxceos.com",  image: "https://picsum.photos/id/206/200/200" },
  { id: "m2", name: "George Bluth",    role: "Brand Manager",           departmentId: "marketing", email: "george.b@sxceos.com", image: "https://picsum.photos/id/207/200/200" },
  { id: "m3", name: "Holly Flax",      role: "Social Media Lead",       departmentId: "marketing", email: "holly.f@sxceos.com",  image: "https://picsum.photos/id/216/200/200" },
  // HR
  { id: "h1", name: "Helen Parr",      role: "Chief People Officer",    departmentId: "hr",        email: "helen.p@sxceos.com",  image: "https://picsum.photos/id/208/200/200" },
  { id: "h2", name: "Ian Malcolm",     role: "HR Manager",              departmentId: "hr",        email: "ian.m@sxceos.com",    image: "https://picsum.photos/id/209/200/200" },
  { id: "h3", name: "Jenna Rink",      role: "Talent Acquisition",      departmentId: "hr",        email: "jenna.r@sxceos.com",  image: "https://picsum.photos/id/217/200/200" },
  // Tech
  { id: "t1", name: "Julia Roberts",   role: "Chief Technology Officer", departmentId: "tech",     email: "julia.r@sxceos.com",  image: "https://picsum.photos/id/210/200/200" },
  { id: "t2", name: "Kevin Flynn",     role: "Engineering Manager",      departmentId: "tech",     email: "kevin.f@sxceos.com",  image: "https://picsum.photos/id/211/200/200" },
  { id: "t3", name: "Linus Torvalds",  role: "Lead Architect",           departmentId: "tech",     email: "linus.t@sxceos.com",  image: "https://picsum.photos/id/218/200/200" },
  // ── Operations ──────────────────────────────────────────────────────────────
  { id: "o1",  name: "Darrell Damareka",                      role: "Chief Operating Officer", departmentId: "ops", email: "darrelldamareka@gmail.com",             image: "https://ui-avatars.com/api/?name=Darrell+Damareka&background=random&color=fff" },
  { id: "o2",  name: "Rendy Putra Bastanta Sitepu",           role: "General Manager",         departmentId: "ops", email: "rendysitepu1510@gmail.com",            image: "https://ui-avatars.com/api/?name=Rendy+Putra&background=random&color=fff" },
  { id: "o3",  name: "Fatimah Janahtun Azzahra",              role: "General Manager",         departmentId: "ops", email: "ftmhjazzl3@gmail.com",                 image: "https://ui-avatars.com/api/?name=Fatimah+Janahtun&background=random&color=fff" },
  { id: "o4",  name: "Dhia Najma Shafa Jinan",                role: "General Manager",         departmentId: "ops", email: "najmadhia740@gmail.com",               image: "https://ui-avatars.com/api/?name=Dhia+Najma&background=random&color=fff" },
  { id: "o5",  name: "Bulan Khayangan",                       role: "Operation Associate",     departmentId: "ops", email: "bulankyg@gmail.com",                   image: "https://ui-avatars.com/api/?name=Bulan+Khayangan&background=random&color=fff" },
  { id: "o6",  name: "Novfrialita Karunia Suhardani",         role: "Operation Associate",     departmentId: "ops", email: "novfrialitasuhardani@gmail.com",       image: "https://ui-avatars.com/api/?name=Novfrialita+Karunia&background=random&color=fff" },
  { id: "o7",  name: "Ilyasa",                                role: "Operation Associate",     departmentId: "ops", email: "ilyasakusnadi014@gmail.com",           image: "https://ui-avatars.com/api/?name=Ilyasa&background=random&color=fff" },
  { id: "o8",  name: "Kalya Salsabila Arizya",                role: "Operation Associate",     departmentId: "ops", email: "kalyasalsabilaarizya@gmail.com",       image: "https://ui-avatars.com/api/?name=Kalya+Salsabila&background=random&color=fff" },
  { id: "o9",  name: "Anisya Syahwa Fitri",                   role: "Operation Associate",     departmentId: "ops", email: "nisyasyahwa@gmail.com",                image: "https://ui-avatars.com/api/?name=Anisya+Syahwa&background=random&color=fff" },
  { id: "o10", name: "Yesha Trixie",                          role: "Operation Associate",     departmentId: "ops", email: "yeshatriyanaa@gmail.com",              image: "https://ui-avatars.com/api/?name=Yesha+Trixie&background=random&color=fff" },
  { id: "o11", name: "Sri Rahayu Lestari",                    role: "Operation Associate",     departmentId: "ops", email: "srirahayu.niaga@gmail.com",            image: "https://ui-avatars.com/api/?name=Sri+Rahayu&background=random&color=fff" },
  { id: "o12", name: "Jesslein Felisha",                      role: "Operation Associate",     departmentId: "ops", email: "jesslein.205240055@stu.untar.ac.id",   image: "https://ui-avatars.com/api/?name=Jesslein+Felisha&background=random&color=fff" },
  { id: "o13", name: "Mas Moreno Ivander Athala",             role: "Operation Associate",     departmentId: "ops", email: "ivanderathala@gmail.com",              image: "https://ui-avatars.com/api/?name=Mas+Moreno&background=random&color=fff" },
  { id: "o14", name: "Mohammad Sang Panglima Anas",           role: "Operation Associate",     departmentId: "ops", email: "panglimaanas@gmail.com",               image: "https://ui-avatars.com/api/?name=Mohammad+Panglima&background=random&color=fff" },
  { id: "o15", name: "Elisabeth Michelle",                    role: "Operation Associate",     departmentId: "ops", email: "elisabethmichelle279@gmail.com",       image: "https://ui-avatars.com/api/?name=Elisabeth+Michelle&background=random&color=fff" },
  { id: "o16", name: "Naurazka Salsabila Aragani",            role: "Operation Associate",     departmentId: "ops", email: "naurazka.aragani@gmail.com",           image: "https://ui-avatars.com/api/?name=Naurazka+Salsabila&background=random&color=fff" },
];

export const REVIEWS: ReviewItem[] = [
  // Finance
  { id: "REC-1000", projectName: "Q3 Financial Report", owner: "Alice Chen", date: "12/28/2025", status: "Completed", value: "$5,940.03", departmentId: "finance" },
  { id: "REC-1001", projectName: "Sponsorship Invoices", owner: "Bob Smith", date: "12/11/2025", status: "Pending", value: "$56.44", departmentId: "finance" },
  { id: "REC-1011", projectName: "Annual Budget Audit", owner: "Alice Chen", date: "01/05/2026", status: "In Review", value: "$12,450.00", departmentId: "finance" },
  // HR
  { id: "REC-1002", projectName: "HR Policy Update", owner: "Helen Parr", date: "12/29/2025", status: "In Review", value: "$79.58", departmentId: "hr" },
  { id: "REC-1012", projectName: "Recruitment Drive Q1", owner: "Ian Malcolm", date: "01/10/2026", status: "Draft", value: "$1,200.00", departmentId: "hr" },
  { id: "REC-1015", projectName: "Employee Satisfaction Survey", owner: "Helen Parr", date: "12/15/2025", status: "Completed", value: "$0.00", departmentId: "hr" },
  // Tech
  { id: "REC-1003", projectName: "Server Migration Log", owner: "Julia Roberts", date: "01/13/2026", status: "Draft", value: "$692.03", departmentId: "tech" },
  { id: "REC-1013", projectName: "Security Patch v2.4", owner: "Kevin Flynn", date: "01/02/2026", status: "Completed", value: "$0.00", departmentId: "tech" },
  { id: "REC-1018", projectName: "Database Optimization", owner: "Linus Torvalds", date: "01/14/2026", status: "Pending", value: "$450.00", departmentId: "tech" },
  // Marketing
  { id: "REC-1004", projectName: "Marketing Campaign Q4", owner: "Fiona Gallagher", date: "12/08/2025", status: "Completed", value: "$2,516.03", departmentId: "marketing" },
  { id: "REC-1014", projectName: "Social Media Ad Spend", owner: "Holly Flax", date: "01/12/2026", status: "Pending", value: "$840.00", departmentId: "marketing" },
  { id: "REC-1019", projectName: "Brand Partnership Deck", owner: "George Bluth", date: "01/08/2026", status: "Draft", value: "$150.00", departmentId: "marketing" },
  // Ops
  { id: "REC-1005", projectName: "Logistics Vendor Contract", owner: "Diana Prince", date: "12/15/2025", status: "In Review", value: "$3,200.00", departmentId: "ops" },
  { id: "REC-1016", projectName: "Event Space Booking", owner: "Evan Wright", date: "01/18/2026", status: "Pending", value: "$1,500.00", departmentId: "ops" },
  { id: "REC-1017", projectName: "Equipment Inventory", owner: "Sarah Connor", date: "12/20/2025", status: "Completed", value: "$0.00", departmentId: "ops" },
];

export const METRICS: StatMetric[] = [
  { label: "Total Students", value: "10,245", trend: "+12% vs last month", trendUp: true, icon: "users" },
  { label: "Active Programs", value: "8", trend: "Stable", trendUp: true, icon: "briefcase" },
  { label: "Partner CEOs", value: "523", trend: "+5 new this week", trendUp: true, icon: "award" },
  { label: "Pending Reviews", value: "142", trend: "-15% vs last week", trendUp: false, icon: "file-text" },
];

export const DEPARTMENTS: Department[] = [
  { id: "finance", name: "Finance", email: "finance@studentsxceos.com", description: "Revenue, Expenses, Budgeting", color: "text-emerald-400", hoverColor: "group-hover:text-emerald-300", icon: "dollar-sign" },
  { id: "ops", name: "Operations", email: "operations@studentsxceos.com", description: "Project Mgmt, Efficiency, Logistics", color: "text-blue-400", hoverColor: "group-hover:text-blue-300", icon: "briefcase" },
  { id: "marketing", name: "Marketing", email: "marketing@studentsxceos.com", description: "Campaigns, Reach, Engagement", color: "text-amber-400", hoverColor: "group-hover:text-amber-300", icon: "megaphone" },
  { id: "hr", name: "Human Resources", email: "hr@studentsxceos.com", description: "Recruiting, Culture, Training", color: "text-indigo-400", hoverColor: "group-hover:text-indigo-300", icon: "users" },
  { id: "tech", name: "Data & Tech", email: "tech@studentsxceos.com", description: "Analytics, Systems, Security", color: "text-purple-400", hoverColor: "group-hover:text-purple-300", icon: "database" },
];

export const DEPARTMENT_DATA: Record<string, { metrics: StatMetric[]; chartData: import("./types").ChartDatum[] }> = {
  // Finance Batch 13 – StudentsxCEOs Jakarta (May–Aug 2025)
  finance: {
    metrics: [
      { label: "Total Revenue", value: "Rp 36.6M", trend: "Batch 13 Programs", trendUp: true, icon: "dollar-sign" },
      { label: "Total Expenses", value: "Rp 14.1M", trend: "Under budget", trendUp: false, icon: "activity" },
      { label: "Net Cash Flow", value: "Rp 22.5M", trend: "+Merch surplus", trendUp: true, icon: "trending-up" },
      { label: "Active Partners", value: "3", trend: "3 tiers secured", trendUp: true, icon: "award" },
    ],
    chartData: [
      { name: "Apr", value: 13000000 }, { name: "May", value: 5405000 }, { name: "Jun", value: 6700000 },
      { name: "Jul", value: 15000000 }, { name: "Aug", value: -8000000 },
    ],
  },
  ops: {
    metrics: [
      { label: "Efficiency Rate", value: "94%", trend: "+2%", trendUp: true, icon: "activity" },
      { label: "Active Projects", value: "12", trend: "+3", trendUp: true, icon: "briefcase" },
      { label: "Team Load", value: "87%", trend: "+5%", trendUp: true, icon: "users" },
      { label: "Issues Resolved", value: "45", trend: "+12", trendUp: true, icon: "check-circle" },
    ],
    chartData: [
      { name: "Mon", value: 5500 }, { name: "Tue", value: 2000 }, { name: "Wed", value: 1500 },
      { name: "Thu", value: 4800 }, { name: "Fri", value: 1500 }, { name: "Sat", value: 1300 }, { name: "Sun", value: 4600 },
    ],
  },
  marketing: {
    metrics: [
      { label: "Total Reach", value: "45.2K", trend: "+24%", trendUp: true, icon: "users" },
      { label: "Engagement", value: "12.8%", trend: "+1.2%", trendUp: true, icon: "activity" },
      { label: "Leads", value: "342", trend: "+15%", trendUp: true, icon: "trending-up" },
      { label: "Ad Spend", value: "$4.2K", trend: "-8%", trendUp: false, icon: "dollar-sign" },
    ],
    chartData: [
      { name: "Mon", value: 1800 }, { name: "Tue", value: 2800 }, { name: "Wed", value: 3100 },
      { name: "Thu", value: 1500 }, { name: "Fri", value: 1400 }, { name: "Sat", value: 2700 }, { name: "Sun", value: 3400 },
    ],
  },
  hr: {
    metrics: [
      { label: "Total Employees", value: "145", trend: "+4", trendUp: true, icon: "users" },
      { label: "Open Roles", value: "8", trend: "-2", trendUp: false, icon: "users" },
      { label: "Satisfaction", value: "4.8/5", trend: "+0.2", trendUp: true, icon: "activity" },
      { label: "Training Hours", value: "320", trend: "+45", trendUp: true, icon: "trending-up" },
    ],
    chartData: [
      { name: "Mon", value: 3600 }, { name: "Tue", value: 5000 }, { name: "Wed", value: 5400 },
      { name: "Thu", value: 2000 }, { name: "Fri", value: 1200 }, { name: "Sat", value: 4000 }, { name: "Sun", value: 3000 },
    ],
  },
  tech: {
    metrics: [
      { label: "System Uptime", value: "99.99%", trend: "0%", trendUp: true, icon: "activity" },
      { label: "Active Users", value: "1,234", trend: "+12%", trendUp: true, icon: "users" },
      { label: "Bugs Reported", value: "12", trend: "-4", trendUp: false, icon: "bug" },
      { label: "Deployments", value: "56", trend: "+8", trendUp: true, icon: "trending-up" },
    ],
    chartData: [
      { name: "Mon", value: 2000 }, { name: "Tue", value: 2050 }, { name: "Wed", value: 3000 },
      { name: "Thu", value: 5000 }, { name: "Fri", value: 3000 }, { name: "Sat", value: 5300 }, { name: "Sun", value: 4000 },
    ],
  },
};

export const PROGRAMS: Program[] = [
  // --- BATCH 14 (Current) ---
  {
    id: "b14-1",
    title: "SxC Grand Summit 2026",
    batch: "Batch 14",
    status: "Active",
    participants: 500,
    mentors: 25,
    location: "Jakarta Convention Center",
    description: "[Placeholder] The flagship annual summit gathering students and industry leaders for the current year.",
    date: "Aug 20, 2026",
    startDate: "2026-08-20",
    endDate: "2026-08-21",
    progress: 15,
    team: ["Nova", "Panglima", "Sarah"] // <--- Clean and easy
  },
  {
    id: "b14-2",
    title: "Executive Mentorship Kickoff",
    batch: "Batch 14",
    status: "Upcoming",
    participants: 50,
    mentors: 10,
    location: "Online (Zoom)",
    description: "[Placeholder] Initial matching and orientation session for the new mentorship program.",
    date: "Sep 10, 2026",
    startDate: "2026-09-10",
    endDate: "2026-09-10",
    progress: 0,
    team: ["Budi", "Alya"]
  },
  // --- BATCH 13 ---
  {
    id: "b13-1",
    title: "Jakarta Leadership Summit",
    batch: "Batch 13",
    status: "Completed",
    participants: 450,
    mentors: 20,
    location: "Balai Kartini",
    description: "[Placeholder] A full-day conference focusing on resilience and innovation in business.",
    date: "Aug 15, 2025",
    startDate: "2025-08-15",
    endDate: "2025-08-15",
    progress: 100,
    team: ["Budi", "Alya"]
  },
  {
    id: "b13-2",
    title: "FMCG Marketing Workshop",
    batch: "Batch 13",
    status: "Completed",
    participants: 120,
    mentors: 5,
    location: "UI Campus",
    description: "[Placeholder] Deep dive into consumer goods marketing strategies with guest speakers.",
    date: "Oct 10, 2025",
    startDate: "2025-10-10",
    endDate: "2025-10-11",
    progress: 100,
    team: ["Budi", "Alya"]
  },

  // --- BATCH 12 ---
  {
    id: "b12-1",
    title: "Tech Startup Bootcamp",
    batch: "Batch 12",
    status: "Completed",
    participants: 200,
    mentors: 15,
    location: "Block71 Jakarta",
    description: "[Placeholder] Intensive weekend workshop for building new business ideas from scratch.",
    date: "Feb 20, 2024",
    startDate: "2024-02-20",
    endDate: "2024-02-22",
    progress: 100,
    team: ["Budi", "Alya"]

  },

  // --- BATCH 11 ---
  {
    id: "b11-1",
    title: "Finance Strategy Masterclass",
    batch: "Batch 11",
    status: "Completed",
    participants: 150,
    mentors: 8,
    location: "Online",
    description: "[Placeholder] Advanced sessions on corporate finance and investment strategies.",
    date: "Nov 05, 2023",
    startDate: "2023-11-05",
    endDate: "2023-11-06",
    progress: 100,
    team: ["Budi", "Alya"]
  },

  // --- BATCH 10 ---
  {
    id: "b10-1",
    title: "National Business Case Competition",
    batch: "Batch 10",
    status: "Completed",
    participants: 300,
    mentors: 30,
    location: "UGM Campus",
    description: "[Placeholder] Nationwide competition for university students to solve real-world business cases.",
    date: "May 12, 2022",
    startDate: "2022-05-12",
    endDate: "2022-05-14",
    progress: 100,
    team: ["Budi", "Alya"]
  },
  {
    id: "b10-2",
    title: "SxC Alumni Networking Night",
    batch: "Batch 10",
    status: "Completed",
    participants: 100,
    mentors: 0,
    location: "Plaza Senayan",
    description: "[Placeholder] An evening dedicated to connecting past members and sharing career opportunities.",
    date: "Dec 10, 2022",
    startDate: "2022-12-10",
    endDate: "2022-12-10",
    progress: 100,
    team: ["Budi", "Alya"]

  }
];

export const RECENT_ACTIVITY: Activity[] = [
  { id: "1", user: "Sarah Jenkins", action: "submitted", target: "Final Case Study - Batch 14", time: "2 hours ago", avatar: "https://picsum.photos/id/1011/100/100" },
  { id: "2", user: "David Chen (CEO)", action: "approved", target: "Mentorship Request #402", time: "4 hours ago", avatar: "https://picsum.photos/id/1005/100/100" },
  { id: "3", user: "System", action: "generated", target: "Weekly Performance Report", time: "1 day ago", avatar: "https://picsum.photos/id/1025/100/100" },
  { id: "4", user: "Amanda Low", action: "joined", target: "Tech Development Bootcamp", time: "1 day ago", avatar: "https://picsum.photos/id/1027/100/100" },
];

export const CHART_DATA: import("./types").ChartDatum[] = [
  { name: "Mon", active: 400, submissions: 240 }, { name: "Tue", active: 300, submissions: 139 },
  { name: "Wed", active: 200, submissions: 980 }, { name: "Thu", active: 278, submissions: 390 },
  { name: "Fri", active: 189, submissions: 480 }, { name: "Sat", active: 239, submissions: 380 },
  { name: "Sun", active: 349, submissions: 430 },
];

// ---------------------------------------------------------------------------
// NEW: Analytics & Reports Tab Context Data
// ---------------------------------------------------------------------------
export const DEPARTMENT_TAB_CONTEXT: Record<string, any> = {
  // Finance Batch 13 – StudentsxCEOs Jakarta (May–Aug 2025)
  finance: {
    // Revenue vs Expense by program (IDR)
    barData: [
      { name: "SxCareer", income: 11500000, expense: 4500000 },
      { name: "Sch. of Ideas", income: 5000000, expense: 2800000 },
      { name: "SxCelerate", income: 2500000, expense: 1500000 },
      { name: "Meet Series", income: 3200000, expense: 2100000 },
      { name: "SxConnect", income: 4200000, expense: 2500000 },
      { name: "Int'l Summit", income: 15000000, expense: 8000000 },
    ],
    // Revenue stream breakdown (%)
    pieData: [
      { name: "Sponsorship", value: 61 },
      { name: "Ticket Sales", value: 28 },
      { name: "Merchandise", value: 8 },
      { name: "Other", value: 3 },
    ],
    // Partnership package reference
    partnershipPackages: [
      { tier: "Lead", priceIDR: 15000000, events: 2, videoSec: 180, igPost: "1×" },
      { tier: "Impact", priceIDR: 12000000, events: 2, videoSec: 120, igPost: "1×" },
      { tier: "Share", priceIDR: 8000000, events: 2, videoSec: 60, igPost: "1×" },
      { tier: "Learn", priceIDR: 5000000, events: 2, videoSec: 40, igPost: "1×" },
      { tier: "Aspire", priceIDR: 2500000, events: 1, videoSec: 40, igPost: "—" },
    ],
    reports: [
      { id: "FIN-B13-01", title: "Batch 13 Merchandise Revenue Summary", date: "May 20, 2025", size: "1.2 MB" },
      { id: "FIN-B13-02", title: "Partnership & Sponsorship Tracker", date: "Jun 05, 2025", size: "2.4 MB" },
      { id: "FIN-B13-03", title: "Batch 13 Net Cash Flow Report", date: "Aug 30, 2025", size: "3.1 MB" },
    ]
  },
  ops: {
    barData: [
      { name: "Week 1", completed: 45, delayed: 5 },
      { name: "Week 2", completed: 52, delayed: 3 },
      { name: "Week 3", completed: 38, delayed: 12 },
      { name: "Week 4", completed: 65, delayed: 2 },
    ],
    pieData: [
      { name: "Logistics", value: 40 },
      { name: "Procurement", value: 30 },
      { name: "Facilities", value: 20 },
      { name: "Safety", value: 10 },
    ],
    reports: [
      { id: "REP-04", title: "Supply Chain Efficiency", date: "Dec 12, 2025", size: "4.2 MB" },
      { id: "REP-05", title: "Vendor SLA Compliance", date: "Jan 10, 2026", size: "1.1 MB" },
      { id: "REP-06", title: "Inventory Status", date: "Feb 01, 2026", size: "5.6 MB" },
    ]
  },
  marketing: {
    barData: [
      { name: "Instagram", reach: 85000, engagement: 12000 },
      { name: "LinkedIn", reach: 45000, engagement: 8500 },
      { name: "TikTok", reach: 120000, engagement: 25000 },
      { name: "Twitter/X", reach: 35000, engagement: 4200 },
    ],
    pieData: [
      { name: "Social Ads", value: 50 },
      { name: "Content Creation", value: 25 },
      { name: "Events", value: 15 },
      { name: "Influencers", value: 10 },
    ],
    reports: [
      { id: "REP-07", title: "Q4 Campaign Performance", date: "Jan 05, 2026", size: "8.4 MB" },
      { id: "REP-08", title: "Audience Demographics", date: "Jan 20, 2026", size: "2.1 MB" },
      { id: "REP-09", title: "Social Media ROI", date: "Feb 10, 2026", size: "3.5 MB" },
    ]
  },
  hr: {
    barData: [
      { name: "Q1", hired: 12, departed: 3 },
      { name: "Q2", hired: 18, departed: 5 },
      { name: "Q3", hired: 8, departed: 2 },
      { name: "Q4", hired: 24, departed: 4 },
    ],
    pieData: [
      { name: "Engineering", value: 40 },
      { name: "Sales", value: 30 },
      { name: "Support", value: 20 },
      { name: "Product", value: 10 },
    ],
    reports: [
      { id: "REP-10", title: "Annual Retention Report", date: "Dec 15, 2025", size: "1.5 MB" },
      { id: "REP-11", title: "Employee Satisfaction Survey", date: "Jan 25, 2026", size: "4.8 MB" },
      { id: "REP-12", title: "Q1 Recruitment Pipeline", date: "Feb 18, 2026", size: "1.2 MB" },
    ]
  },
  tech: {
    barData: [
      { name: "Week 1", deployments: 14, bugs: 2 },
      { name: "Week 2", deployments: 22, bugs: 5 },
      { name: "Week 3", deployments: 18, bugs: 1 },
      { name: "Week 4", deployments: 30, bugs: 4 },
    ],
    pieData: [
      { name: "Frontend", value: 35 },
      { name: "Backend", value: 45 },
      { name: "DevOps", value: 15 },
      { name: "QA", value: 5 },
    ],
    reports: [
      { id: "REP-13", title: "Infrastructure Cost Analysis", date: "Jan 02, 2026", size: "3.2 MB" },
      { id: "REP-14", title: "Security Vulnerability Scan", date: "Feb 01, 2026", size: "7.1 MB" },
      { id: "REP-15", title: "API Performance Metrics", date: "Feb 15, 2026", size: "2.8 MB" },
    ]
  },
};