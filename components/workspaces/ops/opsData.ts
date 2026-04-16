export interface OpsDocument {
  id: string;
  name: string;
  type: "Sheet" | "Doc" | "PDF" | "Folder";
  category: string;
  date: string;
}

export interface OpsEvent {
  id: string;
  name: string;
  attendees: number;
  budget: string;
  date: string;
}

export interface OpsBatch {
  id: string;
  name: string;
  year: string;
  po: string;
  vpo: string;
  theme: string;
  status: "Active" | "Archived";
  events: OpsEvent[];
  pinnedDocs: OpsDocument[];
  allDocs: OpsDocument[];
}

export const OPS_BATCHES: OpsBatch[] = [
  {
    id: "b10",
    name: "Batch 10",
    year: "2021-2022",
    po: "N/A",
    vpo: "N/A",
    theme: "Initial Foundation & Collaborations",
    status: "Archived",
    events: [
      { id: "e10-1", name: "Company Visit x Blibli", attendees: 120, budget: "N/A", date: "Dec 2021" },
      { id: "e10-2", name: "MTC x LinkAja & Tokocrypto", attendees: 250, budget: "N/A", date: "Apr 2022" },
      { id: "e10-3", name: "Meet The Series", attendees: 150, budget: "N/A", date: "Jan 2022" },
      { id: "e10-4", name: "MY x Danone", attendees: 80, budget: "N/A", date: "Feb 2022" },
      { id: "e10-5", name: "MTE x Stockbit", attendees: 150, budget: "N/A", date: "2022" }
    ],
    pinnedDocs: [
      { id: "p10-1", name: "Master Timeline.xlsx", type: "Sheet", category: "Logistics", date: "2021-10-01" },
      { id: "p10-2", name: "OPS IMPORTANT THINGS.xlsx", type: "Sheet", category: "Operations", date: "2021-10-01" },
      { id: "p10-3", name: "Project Managers Allocation.xlsx", type: "Sheet", category: "HR", date: "2021-10-05" }
    ],
    allDocs: [
      { id: "d10-1", name: "16 April - Poster MTC-01.jpg", type: "Doc", category: "Marketing", date: "2022-04-16" },
      { id: "d10-2", name: "Propo Collab LinkAja.pdf", type: "PDF", category: "External", date: "2022-03-10" },
      { id: "d10-3", name: "MoM MTC.docx", type: "Doc", category: "Logistics", date: "2022-04-18" },
      { id: "d10-4", name: "Topic and Trend Research Results.pdf", type: "PDF", category: "Research", date: "2022-01-20" }
    ]
  },
  {
    id: "b13",
    name: "Batch 13",
    year: "2024-2025",
    po: "Nova",
    vpo: "Panglima",
    theme: "Resilience & Innovation",
    status: "Active",
    events: [
      { id: "e1", name: "Jakarta Leadership Summit", attendees: 450, budget: "Rp 150.000.000", date: "Aug 15, 2024" },
      { id: "e2", name: "FMCG Marketing Workshop", attendees: 120, budget: "Rp 25.000.000", date: "Oct 10, 2024" }
    ],
    pinnedDocs: [
      { id: "p1", name: "Batch 13 Master Timeline.xlsx", type: "Sheet", category: "Logistics", date: "2024-05-01" },
      { id: "p2", name: "SxC Grand Budget_Final.xlsx", type: "Sheet", category: "Finance", date: "2024-05-15" },
      { id: "p3", name: "Summit Post-Mortem.docx", type: "Doc", category: "Evaluation", date: "2024-08-20" }
    ],
    allDocs: [
      { id: "d1", name: "Venue_MOU_Draft.pdf", type: "PDF", category: "Legal", date: "2024-06-12" },
      { id: "d2", name: "Speaker_List_v3.xlsx", type: "Sheet", category: "External", date: "2024-07-01" },
      { id: "d3", name: "Volunteer_Shift_Schedule.xlsx", type: "Sheet", category: "Logistics", date: "2024-08-10" },
      { id: "d4", name: "Food_Vendor_Quotes.pdf", type: "PDF", category: "Logistics", date: "2024-07-15" }
    ]
  },
  {
    id: "b12",
    name: "Batch 12",
    year: "2023-2024",
    po: "Sarah",
    vpo: "Budi",
    theme: "Digital Transformation",
    status: "Archived",
    events: [
      { id: "e3", name: "Tech Startup Bootcamp", attendees: 200, budget: "Rp 80.000.000", date: "Feb 20, 2023" }
    ],
    pinnedDocs: [
      { id: "p4", name: "Batch 12 Evaluation.pdf", type: "PDF", category: "Evaluation", date: "2023-11-10" }
    ],
    allDocs: [
      { id: "d5", name: "Bootcamp_Curriculum.docx", type: "Doc", category: "Curriculum", date: "2023-01-15" },
      { id: "d6", name: "Merchandise_Invoices.pdf", type: "PDF", category: "Finance", date: "2023-03-05" }
    ]
  }
];