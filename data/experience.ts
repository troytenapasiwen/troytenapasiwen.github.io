export type System = {
  name: string;
  label: string; // states exactly what my role was
  purpose: string;
  impact?: string;
  contribution: string[];
  skills: string[];
};

export type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  note?: string;
  summary?: string;
  systems: System[];
  generalTitle?: string;
  general?: string[];
};

export const confidentialityNote =
  "Specific implementation details of company systems are not publicly disclosed due to confidentiality.";

const webStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Firebase",
  "Cloud Firestore",
  "Tailwind CSS",
];

export const experience: ExperienceEntry[] = [
  {
    role: "Software Developer Intern",
    company: "Inter-World Shipping Corporation",
    period: "Nov 2025 – May 2026",
    note: "800 hours",
    summary:
      "I contributed primarily to the development, UI/UX, testing, and application workflows of several internal business systems.",
    systems: [
      {
        name: "Inventory Management System",
        label: "Contributed to development and maintenance",
        purpose:
          "An internal application developed to organize and manage company inventory and supplies more efficiently. It moved inventory tracking away from paper-based and manual processes into a centralized digital system.",
        impact:
          "Reduced reliance on paper-based inventory tracking and helped make inventory-related processes less time-consuming and more organized.",
        contribution: [
          "Contributed to the development and maintenance of the system using Next.js, React, TypeScript, Firebase, Cloud Firestore, and Tailwind CSS.",
          "Worked on user interface development and application workflows.",
          "Worked with application data and database-related components.",
          "Performed functional testing and helped identify and resolve issues during development.",
          "Contributed to improvements and refinements based on feedback during development.",
        ],
        skills: webStack,
      },
      {
        name: "Crewing Management System",
        label: "Contributed to development and maintenance",
        purpose:
          "An internal web-based application developed to organize and support company crewing operations and related workflows. It centralized information and processes that previously involved more manual or disconnected methods.",
        impact:
          "Made crewing-related processes more organized by bringing information and workflows into one digital application, reducing reliance on fragmented manual processes.",
        contribution: [
          "Contributed to the development and maintenance of the system using Next.js, React, TypeScript, Firebase, Cloud Firestore, and Tailwind CSS.",
          "Worked on UI/UX and application workflows based on business requirements.",
          "Worked with application data and database-related components.",
          "Performed functional testing and assisted in identifying and resolving application issues.",
          "Contributed to improvements and refinements based on feedback from company personnel during development.",
        ],
        skills: webStack,
      },
      {
        name: "Automated Forms Portal",
        label: "Independently developed",
        purpose:
          "An internal HR web application developed to digitalize form-based processes and reduce reliance on paper documents and manual processing. It provides a centralized way to handle internal forms and makes the process more organized and less time-consuming.",
        impact:
          "Reduced paper-based processing and made form-related workflows more centralized, organized, and efficient.",
        contribution: [
          "Independently developed the portal using Next.js, React, TypeScript, Firebase, Cloud Firestore, and Tailwind CSS.",
          "Designed and implemented the user interface and application workflow based on the required HR processes.",
          "Worked with the application’s data and database components.",
          "Implemented the required digital form processes.",
          "Performed functional testing and resolved issues during development.",
          "Refined the portal based on feedback from intended users.",
        ],
        skills: webStack,
      },
    ],
    generalTitle: "Also in this role",
    general: [
      "Provided day-to-day IT support to employees by diagnosing and resolving hardware and software issues.",
      "Performed software testing and quality checks across internal applications.",
      "Contributed to UI/UX design and application workflow improvements.",
      "Worked with application data and databases.",
      "Assisted in identifying, documenting, and resolving software issues.",
    ],
  },
  {
    role: "IT & Digital Marketing Intern",
    company: "SEAker System Technologies Incorporated",
    period: "Nov 2025 – May 2026",
    note: "Sister company of Inter-World Shipping Corporation. Worked concurrently with the internship above.",
    systems: [
      {
        name: "Marino World Website & CMS",
        label: "Contributed to development",
        purpose:
          "Marino World is a company news and digital publishing website supported by an integrated content management system. The CMS gives a centralized way to manage and publish website content instead of relying entirely on manual website updates.",
        impact:
          "Made content management more centralized and streamlined the process of maintaining and publishing website content.",
        contribution: [
          "Contributed to the development of the website and integrated CMS using Next.js, React, TypeScript, Firebase, Cloud Firestore, and Tailwind CSS.",
          "Worked on interface development and content management functionality.",
          "Assisted with application data and workflow implementation.",
          "Tested functionality and helped identify and resolve issues during development.",
        ],
        skills: webStack,
      },
      {
        name: "Recruitment Management System",
        label: "Researched and designed the process flow. Developers later implemented the system.",
        purpose:
          "Designed to organize and centralize recruitment-related processes into a more structured digital workflow.",
        contribution: [
          "My role focused on research, process analysis, and workflow design, not on developing the system.",
          "Researched existing recruitment processes and requirements.",
          "Consulted with company personnel to understand the required workflow.",
          "Designed the system’s process flow and helped establish the structure of the recruitment workflow.",
          "Created the process flow that developers later used when implementing the system for company clients.",
          "Refined the workflow based on feedback during the planning process.",
        ],
        skills: [],
      },
      {
        name: "Digital Marketing & Content",
        label: "Content and visual design",
        purpose:
          "Social media content to support recruitment, promotion, and communication of product updates.",
        contribution: [
          "Developed job vacancy content for social media.",
          "Created promotional and product update content.",
          "Designed visual materials using Canva.",
          "Prepared and managed content for social media publication.",
        ],
        skills: ["Canva"],
      },
    ],
  },
];
