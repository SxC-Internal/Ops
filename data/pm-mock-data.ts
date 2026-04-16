import type {
    PMUser,
    PMTask,
    PMDashboardStats,
    DDRPerson,
    DDRDocument,
    DDRReport,
    PMNotification,
    TrackingEvent,
    MemberPerformanceData,
    BatchEvaluationData,
    DivisionWorkflow,
    BrainstormNode,
    BrainstormConnection,
} from '@/types/pm-types';

// ─── Users ───────────────────────────────────────────────────────────────────
export const PM_USERS: PMUser[] = [
    // Chief
    { id: 'usr_001', name: 'Muhammad Darrell Damareka',      role: 'Chief',     currentDivision: 'ops', previousDivision: 'Events',    email: 'darrelldamareka@gmail.com',           avatar: 'https://ui-avatars.com/api/?name=Darrell+Damareka&background=random&color=fff' },
    // Managers
    { id: 'usr_002', name: 'Rendy Putra Bastanta Sitepu',    role: 'Manager',   currentDivision: 'ops', previousDivision: 'Events',    email: 'rendysitepu1510@gmail.com',           avatar: 'https://ui-avatars.com/api/?name=Rendy+Putra&background=random&color=fff' },
    { id: 'usr_003', name: 'Dhia Najma Shafa Jinan',         role: 'Manager',   currentDivision: 'ops', previousDivision: 'Marketing', email: 'najmadhia740@gmail.com',              avatar: 'https://ui-avatars.com/api/?name=Dhia+Najma&background=random&color=fff' },
    { id: 'usr_004', name: 'Fatimah Janahtun Azzahra',       role: 'Manager',   currentDivision: 'ops', previousDivision: 'Finance',   email: 'ftmhjazzl3@gmail.com',                avatar: 'https://ui-avatars.com/api/?name=Fatimah+Janahtun&background=random&color=fff' },
    // Associates
    { id: 'usr_005', name: 'Ilyasa',                          role: 'Associate', currentDivision: 'ops', previousDivision: 'HR',        email: 'ilyasakusnadi014@gmail.com',          avatar: 'https://ui-avatars.com/api/?name=Ilyasa&background=random&color=fff' },
    { id: 'usr_006', name: 'Bulan Khayangan',                 role: 'Associate', currentDivision: 'ops', previousDivision: 'Marketing', email: 'bulankyg@gmail.com',                  avatar: 'https://ui-avatars.com/api/?name=Bulan+Khayangan&background=random&color=fff' },
    { id: 'usr_007', name: 'Elisabeth Michelle',              role: 'Associate', currentDivision: 'ops', previousDivision: 'Finance',   email: 'elisabethmichelle279@gmail.com',      avatar: 'https://ui-avatars.com/api/?name=Elisabeth+Michelle&background=random&color=fff' },
    { id: 'usr_008', name: 'Mas Moreno Ivander Athala',       role: 'Associate', currentDivision: 'ops', previousDivision: 'Events',    email: 'ivanderathala@gmail.com',             avatar: 'https://ui-avatars.com/api/?name=Mas+Moreno&background=random&color=fff' },
    { id: 'usr_009', name: 'Novfrialita Karunia Suhardani',   role: 'Associate', currentDivision: 'ops', previousDivision: 'Operations',email: 'novfrialitasuhardani@gmail.com',      avatar: 'https://ui-avatars.com/api/?name=Novfrialita+Karunia&background=random&color=fff' },
    { id: 'usr_010', name: 'Mohammad Sang Panglima Anas',     role: 'Associate', currentDivision: 'ops', previousDivision: 'Tech',      email: 'panglimaanas@gmail.com',              avatar: 'https://ui-avatars.com/api/?name=Mohammad+Anas&background=random&color=fff' },
    { id: 'usr_011', name: 'Naurazka Salsabila Aragani',      role: 'Associate', currentDivision: 'ops', previousDivision: 'Marketing', email: 'naurazka.aragani@gmail.com',          avatar: 'https://ui-avatars.com/api/?name=Naurazka+Aragani&background=random&color=fff' },
    { id: 'usr_012', name: 'Kalya Salsabila Arizya',          role: 'Associate', currentDivision: 'ops', previousDivision: 'Finance',   email: 'kalyasalsabilaarizya@gmail.com',      avatar: 'https://ui-avatars.com/api/?name=Kalya+Arizya&background=random&color=fff' },
    { id: 'usr_013', name: 'Jesslein Felisha',                 role: 'Associate', currentDivision: 'ops', previousDivision: 'HR',        email: 'jesslein.205240055@stu.untar.ac.id',  avatar: 'https://ui-avatars.com/api/?name=Jesslein+Felisha&background=random&color=fff' },
    { id: 'usr_014', name: 'Sri Rahayu Lestari',              role: 'Associate', currentDivision: 'ops', previousDivision: 'Events',    email: 'srirahayu.niaga@gmail.com',           avatar: 'https://ui-avatars.com/api/?name=Sri+Rahayu&background=random&color=fff' },
    { id: 'usr_015', name: 'Anisya Syahwa Fitri',             role: 'Associate', currentDivision: 'ops', previousDivision: 'Marketing', email: 'nisyasyahwa@gmail.com',               avatar: 'https://ui-avatars.com/api/?name=Anisya+Syahwa&background=random&color=fff' },
    { id: 'usr_016', name: 'Yesha Trixie',                    role: 'Associate', currentDivision: 'ops', previousDivision: 'Tech',      email: 'yeshatriyanaa@gmail.com',             avatar: 'https://ui-avatars.com/api/?name=Yesha+Trixie&background=random&color=fff' },
];

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const PM_TASKS: PMTask[] = [
    { id: 'tsk_101', title: 'Draft MoU for Tech Partner', status: 'On going', assigneeId: 'usr_003', division: 'ops', progressPercentage: 45, dueDate: '2026-03-10', dependencies: [], startDate: '2026-02-20', description: 'Draft the Memorandum of Understanding for the upcoming tech partnership collaboration.', links: [{ label: 'MoU Template', url: 'https://docs.google.com/document/d/mou-template' }, { label: 'Partner Info Sheet', url: 'https://drive.google.com/file/partner-info' }], attachments: [{ name: 'MoU_Draft_v1.pdf', url: '#', type: 'application/pdf' }] },
    { id: 'tsk_102', title: 'Review and Approve MoU', status: 'To do', assigneeId: 'usr_007', division: 'ops', progressPercentage: 0, dueDate: '2026-03-12', dependencies: ['tsk_101'], startDate: '2026-03-10', description: 'Review the drafted MoU and provide approval or feedback.' },
    { id: 'tsk_103', title: 'Finalize Venue Booking', status: 'Done', assigneeId: 'usr_002', division: 'ops', progressPercentage: 100, dueDate: '2026-03-05', dependencies: [], startDate: '2026-02-15', description: 'Confirm and finalize the venue booking for the Annual Tech Summit.', links: [{ label: 'Venue Contract', url: 'https://drive.google.com/file/venue-contract' }] },
    { id: 'tsk_104', title: 'Design Event Poster', status: 'On going', assigneeId: 'usr_003', division: 'ops', progressPercentage: 70, dueDate: '2026-03-08', dependencies: ['tsk_103'], startDate: '2026-03-01', description: 'Coordinate with marketing to create the poster for the Annual Tech Summit.', attachments: [{ name: 'Poster_Draft.png', url: '#', type: 'image/png' }] },
    { id: 'tsk_105', title: 'Send Sponsor Invitations', status: 'To do', assigneeId: 'usr_002', division: 'ops', progressPercentage: 0, dueDate: '2026-03-14', dependencies: ['tsk_104'], startDate: '2026-03-09', description: 'Send out formal invitations to all potential sponsors.' },
    { id: 'tsk_106', title: 'Prepare Speaker Briefing', status: 'Pending', assigneeId: 'usr_002', division: 'ops', progressPercentage: 20, dueDate: '2026-03-18', dependencies: ['tsk_103'], startDate: '2026-03-06', description: 'Compile briefing materials for confirmed speakers.' },
    { id: 'tsk_107', title: 'Update Website Content', status: 'To do', assigneeId: 'usr_003', division: 'ops', progressPercentage: 0, dueDate: '2026-03-20', dependencies: ['tsk_104'], startDate: '2026-03-10', description: 'Track the website update with new poster, schedule, and speaker info.' },
    { id: 'tsk_108', title: 'Coordinate Catering Service', status: 'Not yet', assigneeId: 'usr_003', division: 'ops', progressPercentage: 0, dueDate: '2026-03-22', dependencies: ['tsk_103'], startDate: '2026-03-12', description: 'Select and coordinate catering for the summit event day.' },
    { id: 'tsk_109', title: 'Budget Report Q1', status: 'On going', assigneeId: 'usr_007', division: 'ops', progressPercentage: 60, dueDate: '2026-03-15', dependencies: [], startDate: '2026-03-01', description: 'Compile the operations Q1 budget and expenditure report.' },
    { id: 'tsk_110', title: 'Social Media Campaign Launch', status: 'To do', assigneeId: 'usr_002', division: 'ops', progressPercentage: 0, dueDate: '2026-03-25', dependencies: ['tsk_104', 'tsk_107'], startDate: '2026-03-20', description: 'Ensure the social media campaign is launched properly by marketing.' },
];

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export const PM_DASHBOARD_STATS: PMDashboardStats = {
    activeParticipants: 120,
    activeMentors: 15,
    activeEvents: 3,
    memberMotivationPercentage: 85,
    programs: [
        {
            id: 'prog_01', name: 'Annual Tech Summit', status: 'On Going', division: 'Operations',
            picId: 'usr_002', progressPercentage: 65, nearestDeadline: '2026-03-15',
            okrs: [
                {
                    id: 'okr_1',
                    objective: 'Secure 5 Sponsors',
                    progressPercentage: 15,                               // fallback
                    taskIds: ['tsk_101', 'tsk_102', 'tsk_105'],          // MoU draft → review → send invitations
                },
                {
                    id: 'okr_2',
                    objective: 'Finalize Venue & Logistics',
                    progressPercentage: 50,
                    taskIds: ['tsk_103', 'tsk_108'],                     // Venue booking + catering
                },
                {
                    id: 'okr_3',
                    objective: 'Confirm 10 Speakers & Promote Event',
                    progressPercentage: 10,
                    taskIds: ['tsk_106', 'tsk_107', 'tsk_110'],          // Speaker briefing + website + campaign
                },
            ],
        },
        {
            id: 'prog_04', name: 'Community Meetup', status: 'Done', division: 'Operations',
            picId: 'usr_002', progressPercentage: 100, nearestDeadline: '2026-02-28',
            okrs: [
                { id: 'okr_8', objective: 'Host 3 sessions', progressPercentage: 100 },
                { id: 'okr_9', objective: '200 attendees', progressPercentage: 100 },
            ],
        },
    ],
};

// ─── Division Workflows ──────────────────────────────────────────────────────
export const PM_WORKFLOWS: DivisionWorkflow[] = [
    { division: 'Operations', picId: 'usr_002', picName: 'Rendy Putra Bastanta Sitepu', picEmail: 'rendy.putra@sxc.ac.id', tasks: ['Venue coordination', 'Vendor management', 'Catering'], progressPercentage: 65 },
];

// ─── DDR Database ────────────────────────────────────────────────────────────
export const DDR_PEOPLE: DDRPerson[] = [
    { id: 'cnt_001', type: 'Mentor', name: 'Dr. Sarah Chen', role: 'Senior Guide', contactInfo: 'sarah@example.com', curriculumRef: 'Tech Leadership', previousDivision: 'N/A', currentDivision: 'Mentorship' },
    { id: 'cnt_002', type: 'Mentor', name: 'Prof. David Kim', role: 'Academic Advisor', contactInfo: 'david.kim@university.edu', curriculumRef: 'Business Strategy', previousDivision: 'Research', currentDivision: 'Mentorship' },
    { id: 'cnt_003', type: 'Speaker', name: 'Jane Doe', role: 'Keynote Speaker', contactInfo: 'jane@techcorp.com', previousDivision: 'N/A', currentDivision: 'External' },
    { id: 'cnt_004', type: 'Speaker', name: 'Michael Zhang', role: 'Panel Speaker', contactInfo: 'michael.z@startup.io', previousDivision: 'N/A', currentDivision: 'External' },
    { id: 'cnt_005', type: 'Judge', name: 'Lisa Wang', role: 'Head Judge', contactInfo: 'lisa@vc.com', previousDivision: 'N/A', currentDivision: 'Advisory' },
    { id: 'cnt_006', type: 'Participant', name: 'Ahmad Fauzi', role: 'Student', contactInfo: 'ahmad@student.edu', previousDivision: 'N/A', currentDivision: 'Batch 14' },
    { id: 'cnt_007', type: 'Participant', name: 'Siti Nurhaliza', role: 'Student', contactInfo: 'siti@student.edu', previousDivision: 'N/A', currentDivision: 'Batch 14' },
    { id: 'cnt_008', type: 'Internal', name: 'Darrell Damareka',           role: 'Chief',           contactInfo: 'darrell.damareka@sxc.ac.id', previousDivision: 'Events',    currentDivision: 'Operations', internalRole: 'Chief' },
    { id: 'cnt_009', type: 'Internal', name: 'Rendy Putra Bastanta Sitepu', role: 'General Manager', contactInfo: 'rendy.putra@sxc.ac.id',      previousDivision: 'Events',    currentDivision: 'Operations', internalRole: 'GM' },
    { id: 'cnt_010', type: 'Internal', name: 'Bulan Khayangan',             role: 'Associate',       contactInfo: 'bulan.khayangan@sxc.ac.id',  previousDivision: 'Marketing', currentDivision: 'Operations', internalRole: 'Asso' },
];

export const DDR_DOCUMENTS: DDRDocument[] = [
    { id: 'doc_001', type: 'Draft', documentType: 'MoU', title: 'Sponsorship Agreement - Innovate Inc', status: 'Pending Review', lastModified: '2026-03-01', owner: 'Bulan Khayangan' },
    { id: 'doc_002', type: 'Draft', documentType: 'TOR', title: 'Event Committee TOR 2026', status: 'Approved', lastModified: '2026-02-20', owner: 'Rendy Putra Bastanta Sitepu' },
    { id: 'doc_003', type: 'Draft', documentType: 'Proposal', title: 'Tech Summit Proposal v2', status: 'Draft', lastModified: '2026-02-28', owner: 'Darrell Damareka' },
    { id: 'doc_006', type: 'Draft', documentType: 'MoU', title: 'University Partnership MoU', status: 'Draft', lastModified: '2026-03-03', owner: 'Rendy Putra Bastanta Sitepu' },
];

export const DDR_REPORTS: DDRReport[] = [
    { id: 'rpt_001', title: 'Q1 Evaluation Report', type: 'Evaluation', date: '2026-03-01', summary: 'Overall program performance above expectations.' },
    { id: 'rpt_002', title: 'Member Motivation Report - March', type: 'Motivation', date: '2026-03-05', percentage: 85 },
    { id: 'rpt_003', title: 'February Evaluation Report', type: 'Evaluation', date: '2026-02-28', summary: 'Slight delays in operations deliverables.' },
    { id: 'rpt_004', title: 'Member Motivation Report - February', type: 'Motivation', date: '2026-02-05', percentage: 78 },
    { id: 'rpt_005', title: 'Member Motivation Report - January', type: 'Motivation', date: '2026-01-05', percentage: 82 },
];

// ─── Notifications ───────────────────────────────────────────────────────────
export const PM_NOTIFICATIONS: PMNotification[] = [
    { id: 'ntf_001', type: 'deadline', title: 'Deadline Approaching', message: 'Draft MoU for Tech Partner is due in 5 days', timestamp: '2026-03-05T14:00:00Z', isRead: false, relatedTaskId: 'tsk_101' },
    { id: 'ntf_002', type: 'task_update', title: 'Task Progress Updated', message: 'Bulan Khayangan updated progress on Draft MoU to 45%', timestamp: '2026-03-05T10:30:00Z', isRead: false, relatedTaskId: 'tsk_101', relatedUserId: 'usr_003' },
    { id: 'ntf_003', type: 'approval', title: 'Approval Required', message: 'Sponsorship Agreement MoU needs your review', timestamp: '2026-03-04T16:00:00Z', isRead: true, relatedTaskId: 'tsk_102' },
    { id: 'ntf_004', type: 'mention', title: 'You were mentioned', message: 'Darrell Damareka mentioned you in Budget Report Q1', timestamp: '2026-03-04T09:00:00Z', isRead: true, relatedUserId: 'usr_007' },
    { id: 'ntf_005', type: 'system', title: 'Weekly Summary Ready', message: 'Your weekly project summary is ready to view', timestamp: '2026-03-03T08:00:00Z', isRead: true },
    { id: 'ntf_006', type: 'deadline', title: 'Overdue Task', message: 'Finalize Venue Booking was due on March 5', timestamp: '2026-03-05T18:00:00Z', isRead: false, relatedTaskId: 'tsk_103' },
];

// ─── Tracking Data ───────────────────────────────────────────────────────────
export const TRACKING_EVENTS: TrackingEvent[] = [
    { id: 'evt_001', name: 'Annual Tech Summit', progressPercentage: 65, status: 'On Going' },
    { id: 'evt_002', name: 'Leadership Workshop', progressPercentage: 10, status: 'Planning' },
    { id: 'evt_003', name: 'Marketing Bootcamp', progressPercentage: 40, status: 'Preparation' },
    { id: 'evt_004', name: 'Community Meetup', progressPercentage: 100, status: 'Completed' },
];

export const MEMBER_PERFORMANCE: MemberPerformanceData[] = [
    { userId: 'usr_007', name: 'Darrell Damareka',           motivationScore: 95 },
    { userId: 'usr_002', name: 'Rendy Putra Bastanta Sitepu', motivationScore: 90 },
    { userId: 'usr_003', name: 'Bulan Khayangan',             motivationScore: 78 },
];

export const BATCH_EVALUATIONS: BatchEvaluationData[] = [
    { batchName: 'Batch 14', overallScore: 87, taskCompletion: 85, attendance: 92, motivation: 85 },
    { batchName: 'Batch 13', overallScore: 91, taskCompletion: 90, attendance: 95, motivation: 88 },
    { batchName: 'Batch 12', overallScore: 84, taskCompletion: 82, attendance: 88, motivation: 80 },
];

// ─── Brainstorm Sample Data ──────────────────────────────────────────────────
export const SAMPLE_BRAINSTORM_NODES: BrainstormNode[] = [
    { id: 'bn_001', type: 'sticky', x: 80, y: 80, width: 200, height: 150, text: 'Current State (As-Is)\n• Manual tracking\n• Email-based comms\n• Spreadsheet reports', color: '#fbbf24' },
    { id: 'bn_002', type: 'sticky', x: 400, y: 80, width: 200, height: 150, text: 'Future State (To-Be)\n• Automated dashboards\n• Real-time notifications\n• Integrated PM tools', color: '#34d399' },
    { id: 'bn_003', type: 'rectangle', x: 80, y: 320, width: 180, height: 80, text: 'User Registration', color: '#60a5fa' },
    { id: 'bn_004', type: 'diamond', x: 350, y: 310, width: 140, height: 100, text: 'Approved?', color: '#f472b6' },
    { id: 'bn_005', type: 'rectangle', x: 570, y: 320, width: 180, height: 80, text: 'Assign to Team', color: '#60a5fa' },
    { id: 'bn_006', type: 'oval', x: 240, y: 480, width: 160, height: 70, text: 'Start', color: '#a78bfa' },
];

export const SAMPLE_BRAINSTORM_CONNECTIONS: BrainstormConnection[] = [
    { id: 'bc_001', fromNodeId: 'bn_003', toNodeId: 'bn_004' },
    { id: 'bc_002', fromNodeId: 'bn_004', toNodeId: 'bn_005' },
];

// ─── Meeting Attendance Mock ─────────────────────────────────────────────────
export const MEETING_ATTENDANCE = [
    { meeting: 'Weekly Standup #1', date: '2026-02-03', attended: 5, total: 6 },
    { meeting: 'Weekly Standup #2', date: '2026-02-10', attended: 6, total: 6 },
    { meeting: 'Weekly Standup #3', date: '2026-02-17', attended: 4, total: 6 },
    { meeting: 'Weekly Standup #4', date: '2026-02-24', attended: 6, total: 6 },
    { meeting: 'Weekly Standup #5', date: '2026-03-03', attended: 5, total: 6 },
];
