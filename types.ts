export type ProgramStatus = 'Active' | 'Upcoming' | 'Completed';
export type UserRole = 'admin' | 'finance' | 'ops' | 'marketing' | 'hr' | 'tech';
export type ReviewStatus = 'Completed' | 'Pending' | 'In Review' | 'Draft';

// ----- Schema-aligned (dummy DB) types -----

export type UUID = string;

export type DepartmentSlug = Exclude<UserRole, 'admin'>;

export interface DbUser {
  id: UUID;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbDepartment {
  id: UUID;
  name: string;
  slug: DepartmentSlug;
  createdAt: string;
}

export type MembershipRole = 'head' | 'manager' | 'member';

export interface DbUserDepartment {
  id: UUID;
  userId: UUID;
  departmentId: UUID;
  role: MembershipRole;
  createdAt: string;
}

export type FinanceTransactionType = 'income' | 'expense';

export interface DbFinanceTransaction {
  id: UUID;
  title: string;
  amount: number;
  type: FinanceTransactionType;
  transactionDate: string;
  departmentId: UUID;
  createdBy: UUID;
  createdAt: string;
}

export type HrMemberStatus = 'active' | 'inactive' | 'probation' | 'on_leave';

export interface DbHrMember {
  id: UUID;
  userId: UUID;
  position: string;
  joinDate: string;
  status: HrMemberStatus;
  departmentId: UUID;
  createdAt: string;
}

export interface DbAnalyticsReport {
  id: UUID;
  title: string;
  fileUrl: string;
  departmentId: UUID;
  createdBy: UUID;
  createdAt: string;
}

export interface DbMarketingCampaign {
  id: UUID;
  name: string;
  platform: string;
  budget: number;
  startDate: string;
  endDate: string;
  departmentId: UUID;
  createdAt: string;
}

export type OperationsTaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export interface DbOperationsTask {
  id: UUID;
  title: string;
  status: OperationsTaskStatus;
  deadline: string;
  assignedTo: UUID;
  departmentId: UUID;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  departmentId?: string; // If null, assume admin/global
  membershipRole?: MembershipRole;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  image: string;
  email: string;
}

export interface Program {
  id: string;
  title: string;
  batch: string;
  status: "Active" | "Completed" | "Upcoming";
  participants: number;
  mentors: number;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  progress: number;
  location: string;
  team: string[];
}

export interface ReviewItem {
  id: string;
  projectName: string;
  owner: string;
  date: string;
  status: ReviewStatus;
  value: string;
  departmentId: string;
}

export interface StatMetric {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
}

export type ChartDatum = {
  name: string;
  [key: string]: number | string;
};

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
}

export interface Department {
  id: string;
  name: string;
  email: string;
  description: string;
  color: string;
  hoverColor: string;
  icon: string;
}

export enum View {
  DATA_REVIEW = 'DATA_REVIEW',
  PROGRAMS = 'PROGRAMS',
  MEMBERS = 'MEMBERS',
  SETTINGS = 'SETTINGS',
  WORKSPACE = 'WORKSPACE',
  // PM Views
  PM_DASHBOARD = 'PM_DASHBOARD',
  KANBAN = 'KANBAN',
  ROADMAP = 'ROADMAP',
  BRAINSTORM = 'BRAINSTORM',
  DDR = 'DDR',
  TRACKING = 'TRACKING',
}

export type Theme = 'dark' | 'light';