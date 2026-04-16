/**
 * ─── SxC Division Portal Config ───────────────────────────────────────────────
 *
 * This is the single file other division teams need to edit to connect their
 * internal portal to this hub.
 *
 * For each division, set:
 *   - `url`    → The URL of your division's internal app (relative or absolute)
 *   - `active` → Set to `true` when the app is ready
 */

export interface Division {
    id: string;
    name: string;
    shortName: string;
    description: string;
    icon: string;           // Emoji or short symbol
    color: string;          // Tailwind gradient classes
    accentColor: string;    // For the hover ring / badge
    url: string;            // Where clicking the card goes
    active: boolean;        // false = "Coming Soon" placeholder
}

export const DIVISIONS: Division[] = [
    {
        id: "operations",
        name: "Operations",
        shortName: "Ops",
        description: "Project management, task tracking, and operational workflows.",
        icon: "⚙️",
        color: "from-blue-600 to-indigo-700",
        accentColor: "ring-blue-500",
        url: "/",            // ← The current SxC Ops internal app
        active: true,
    },
    {
        id: "marketing",
        name: "Marketing",
        shortName: "Mktg",
        description: "Campaigns, brand assets, social media, and growth analytics.",
        icon: "📣",
        color: "from-pink-500 to-rose-600",
        accentColor: "ring-pink-500",
        url: "#",            // ← Replace with Marketing team's URL when ready
        active: false,
    },
    {
        id: "hr",
        name: "Human Resources",
        shortName: "HR",
        description: "Recruitment, onboarding, people management, and policy hub.",
        icon: "🧑‍🤝‍🧑",
        color: "from-violet-500 to-purple-700",
        accentColor: "ring-violet-500",
        url: "#",            // ← Replace with HR team's URL when ready
        active: false,
    },
    {
        id: "tech",
        name: "Data & Technology",
        shortName: "D&T",
        description: "Data pipelines, infrastructure, analytics, and tech tools.",
        icon: "💻",
        color: "from-emerald-500 to-teal-700",
        accentColor: "ring-emerald-500",
        url: "#",            // ← Replace with D&T team's URL when ready
        active: false,
    },
    {
        id: "finance",
        name: "Finance",
        shortName: "Fin",
        description: "Budgeting, financial reports, invoicing, and treasury.",
        icon: "💰",
        color: "from-amber-500 to-orange-600",
        accentColor: "ring-amber-500",
        url: "#",            // ← Replace with Finance team's URL when ready
        active: false,
    },
];
