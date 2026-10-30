import { stackNames, type Figure, type Logo, type Note, type TechStack } from "./media";

export type System = {
  name: string;
  label: string; // states exactly what my role was
  purpose: string;
  impact?: string;
  contribution: string[];
  skills: string[];
  /** Technologies grouped as frontend / backend / deployment. When set, `skills` is derived from it. */
  stack?: TechStack;
  /** Real screenshots (login screens only for company systems) and the notes that go with them. */
  evidence?: {
    figures: Figure[];
    note?: Note;
    /** A short relationship label, shown as a small "connected" marker. */
    relation?: string;
  };
};

export type ExperienceEntry = {
  role: string;
  company: string;
  logo?: Logo;
  period: string;
  note?: string;
  /**
   * Shown in the plain edition only. The folder view has its own page for this company and leaves this out,
   * because the wording refers to the entry printed above it in the plain edition.
   */
  plainNote?: string;
  summary?: string;
  systems: System[];
  generalTitle?: string;
  general?: string[];
};

/** The same quiet wording on every internal company system, so the notes read as one family. */
const internalNote = (extra: string): Note => ({
  tone: "internal",
  label: "Internal company system",
  text: `An internal company system developed during my internship. Only the login screen is shown as a portfolio demonstration. ${extra}`,
});

export const confidentialityNote =
  "Specific implementation details of company systems are not publicly disclosed due to confidentiality.";

/** The internal Inter-World systems are hosted on Vercel. */
const internalStack: TechStack = {
  frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  backend: ["Firebase", "Cloud Firestore"],
  deployment: [{ name: "Vercel" }],
};

/** Marino World uses the same web technologies; no hosting platform is documented, so no deployment is listed. */
const marinoStack: TechStack = {
  frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  backend: ["Firebase", "Cloud Firestore"],
};

export const experience: ExperienceEntry[] = [
  {
    role: "Software Developer Intern",
    company: "Inter-World Shipping Corporation",
    logo: { src: "/images/inter-world.jpeg", alt: "Inter-World Shipping Corporation logo", width: 447, height: 447 },
    period: "Nov 2025 – May 2026",
    note: "800 hours",
    summary:
      "I contributed primarily to the development, UI/UX, testing, and application workflows of several internal business systems.",
    systems: [
      {
        name: "Inventory Management System",
        label: "Contributed to development and maintenance.",
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
        skills: stackNames(internalStack),
        stack: internalStack,
        evidence: {
          figures: [
            {
              src: "/images/ims.png",
              alt: "Login screen of the Inventory Management System: the company logo above an email and password form, over a blurred photograph of ships.",
              width: 2880,
              height: 1634,
              caption: "Inventory Management System, login screen",
            },
          ],
          note: internalNote("The system and its internal access links cannot be shared publicly."),
        },
      },
      {
        name: "Crewing Management System",
        label: "Contributed to development and maintenance.",
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
        skills: stackNames(internalStack),
        stack: internalStack,
        evidence: {
          figures: [
            {
              src: "/images/cms.jpeg",
              alt: "Login screen of the Crewing Management System: the company logo above an email and password form, over a blurred photograph of ships.",
              width: 1024,
              height: 580,
              caption: "Crewing Management System, login screen",
            },
          ],
          note: internalNote("The application cannot be shared publicly."),
          relation: "Connected internal system: interconnected with the Inventory Management System",
        },
      },
      {
        name: "Automated Forms Portal",
        label: "Independently developed.",
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
        skills: stackNames(internalStack),
        stack: internalStack,
        evidence: {
          figures: [
            {
              src: "/images/FORMS PORTAL.png",
              alt: "Sign-in screen of the ISC Forms Portal on a dark navy background, with an email and password form beside the company logo.",
              width: 2880,
              height: 1634,
              caption: "Automated Forms Portal, sign-in screen",
            },
          ],
          note: {
            tone: "internal",
            label: "Separate internal system",
            text: "An HR system for Human Resources and the relevant employees or approvers. It is not another screen of the Inventory or Crewing Management systems. Only the sign-in screen is shown; the application cannot be shared publicly.",
          },
        },
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
    logo: {
      src: "/images/seaker.png",
      alt: "SEAker System Technologies logo",
      width: 1200,
      height: 630,
      // The mark sits in the middle of a wide navy card: zoom into it rather than squeezing the whole card into a square.
      crop: { cx: 600, cy: 315, size: 560 },
    },
    period: "Nov 2025 – May 2026",
    plainNote: "Sister company of Inter-World Shipping Corporation. Worked concurrently with the internship above.",
    systems: [
      {
        name: "Marino World Website & CMS",
        label: "Contributed to development",
        purpose:
          "Marino World is a partner of Seaker System Technologies. Seaker contributed to the development of Marino World's website and its integrated content management system. The CMS provides a centralized way to manage and publish website content, reducing the need for manual website updates.",
        impact:
          "Made content management more centralized and streamlined the process of maintaining and publishing website content.",
        contribution: [
          "Contributed to the development of the website and integrated CMS using Next.js, React, TypeScript, Firebase, Cloud Firestore, and Tailwind CSS.",
          "Worked on interface development and content management functionality.",
          "Assisted with application data and workflow implementation.",
          "Tested functionality and helped identify and resolve issues during development.",
        ],
        skills: stackNames(marinoStack),
        stack: marinoStack,
        evidence: {
          figures: [
            {
              src: "/images/marinoworld.JPG",
              alt: "Marino World website: the E-Magazine library page listing the latest magazine editions on a dark navy layout.",
              width: 1600,
              height: 836,
              caption: "E-Magazine library",
            },
            {
              src: "/images/marinoworldd.JPG",
              alt: "Marino World website: a news page with a featured story and two smaller headlines beside it.",
              width: 1600,
              height: 793,
              caption: "News and top stories",
            },
          ],
        },
      },
      {
        name: "Recruitment Management System",
        label: "Researched and designed the recruitment workflow. Developers later implemented the process as part of the larger Recruitment Management System.",
        purpose:
          "The Recruitment Management System is a broader platform designed to organize and centralize recruitment-related processes into a more structured digital workflow.",
        contribution: [
          "My role focused on research, process analysis, and workflow design specifically for the recruitment process, not on developing the system.",
          "Researched existing recruitment processes and requirements.",
          "Consulted with company personnel to understand the required recruitment workflow.",
          "Designed the process flow for the recruitment component of the larger system.",
          "Created the recruitment workflow documentation that developers later used when implementing the system for company clients.",
          "Refined the recruitment workflow based on feedback during the planning process.",
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
        skills: ["Canva", "CapCut", "Meta Business Suite"],
      },
    ],
  },
];
