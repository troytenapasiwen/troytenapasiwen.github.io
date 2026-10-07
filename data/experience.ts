export type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  note?: string;
  highlights: string[];
  skills: string[];
};

export const experienceNote =
  "These were internal company systems. Details are confidential, so this section describes the type of work only.";

export const experience: ExperienceEntry[] = [
  {
    role: "Software Developer Intern",
    company: "Inter-World Shipping Corporation",
    period: "Nov 2025 – May 2026",
    note: "800-hour internship",
    highlights: [
      "Developed and maintained internal web applications for business workflows, covering areas such as HR processes, inventory and asset management, crew management, and digital forms.",
      "Contributed to software testing and QA, UI/UX, and database-related work across these applications.",
      "Provided IT support, diagnosing and resolving employee hardware and software issues.",
    ],
    skills: ["Next.js", "React", "TypeScript", "Firebase", "Cloud Firestore", "Tailwind CSS"],
  },
  {
    role: "IT & Digital Marketing Intern",
    company: "SEAker System Technologies Incorporated",
    period: "Nov 2025 – May 2026",
    note: "Concurrent with the internship at its sister company",
    highlights: [
      "Contributed to a company news website and its CMS integration.",
      "Researched and designed the process flow for a recruitment management system, which developers later implemented.",
      "Created and managed job vacancy, promotional, and product update content on social media.",
    ],
    skills: ["Next.js", "React", "TypeScript", "Firebase", "Tailwind CSS"],
  },
];