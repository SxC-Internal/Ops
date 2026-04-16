// ─── PM Role & User Types ────────────────────────────────────────────────────
export type PMRole = 'Chief' | 'Manager' | 'Associate';

export interface PMUser {
    id: string;
    name: string;
    role: PMRole;
    currentDivision: string;
    previousDivision: string;
    email: string;
    avatar?: string;
}

// ─── Task Types ──────────────────────────────────────────────────────────────
export type PMTaskStatus = 'To do' | 'On going' | 'Done' | 'Pending' | 'Not yet';

export interface TaskLink {
    label: string;
    url: string;
}

export interface TaskAttachment {
    name: string;
    url: string;
    type: string;
}

export interface PMTask {
    id: string;
    title: string;
    status: PMTaskStatus;
    assigneeId: string;
    division: string;
    progressPercentage: number;
    dueDate: string;
    dependencies: string[];
    description?: string;
    startDate?: string;
    meetingLink?: string;
    links?: TaskLink[];
    attachments?: TaskAttachment[];
}

// ─── OKR Types ───────────────────────────────────────────────────────────────
export interface PMOKR {
    id: string;
    objective: string;
    progressPercentage: number;  // Used as fallback if taskIds is empty
    taskIds?: string[];           // Link to PM_TASKS — progress auto-calculated from these tasks
}

// ─── Program Types ───────────────────────────────────────────────────────────
export type PMProgramStatus = 'Not yet' | 'On Going' | 'Pending' | 'Done';

export interface PMProgram {
    id: string;
    name: string;
    status: PMProgramStatus;
    division: string;
    picId: string;
    progressPercentage: number;
    nearestDeadline: string;
    okrs: PMOKR[];
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface PMDashboardStats {
    activeParticipants: number;
    activeMentors: number;
    activeEvents: number;
    memberMotivationPercentage: number;
    programs: PMProgram[];
}

// ─── DDR (Database/Draft/Report) Types ───────────────────────────────────────
export type DDRPersonType = 'Mentor' | 'Speaker' | 'Judge' | 'Participant' | 'Internal';
export type DDRInternalRole = 'Chief' | 'GM' | 'Asso';
export type DDRDocumentType = 'MoU' | 'TOR' | 'Proposal' | 'Deck' | 'SOP';
export type DDRDocStatus = 'Pending Review' | 'Approved' | 'Draft' | 'Archived';

export interface DDRPerson {
    id: string;
    type: DDRPersonType;
    name: string;
    role: string;
    contactInfo: string;
    curriculumRef?: string;
    previousDivision: string;
    currentDivision: string;
    internalRole?: DDRInternalRole;
}

export interface DDRDocument {
    id: string;
    type: 'Draft';
    documentType: DDRDocumentType;
    title: string;
    status: DDRDocStatus;
    lastModified?: string;
    owner?: string;
}

export interface DDRReport {
    id: string;
    title: string;
    type: 'Evaluation' | 'Motivation';
    date: string;
    percentage?: number;
    summary?: string;
}

// ─── Notification Types ──────────────────────────────────────────────────────
export type NotificationType = 'task_update' | 'deadline' | 'approval' | 'mention' | 'system' | 'reminder';

export interface PMNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    relatedTaskId?: string;
    relatedUserId?: string;
}

// ─── Tracking Types ──────────────────────────────────────────────────────────
export interface TrackingEvent {
    id: string;
    name: string;
    progressPercentage: number;
    status: string;
}

export interface QuestionChoice {
    id: string;
    text: string;
    value: number;
}

export interface MemberPerformanceData {
    userId: string;
    name: string;
    motivationScore: number;
}

export interface BatchEvaluationData {
    batchName: string;
    overallScore: number;
    taskCompletion: number;
    attendance: number;
    motivation: number;
}

// ─── Brainstorm Types ────────────────────────────────────────────────────────
export type BrainstormNodeType = 'sticky' | 'rectangle' | 'diamond' | 'oval' | 'text';

export interface BrainstormNode {
    id: string;
    type: BrainstormNodeType;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    color: string;
}

export interface BrainstormConnection {
    id: string;
    fromNodeId: string;
    toNodeId: string;
    label?: string;
}

// ─── Division Workflow Types ─────────────────────────────────────────────────
export interface DivisionWorkflow {
    division: string;
    picId: string;
    picName: string;
    picEmail: string;
    tasks: string[];
    progressPercentage: number;
}
