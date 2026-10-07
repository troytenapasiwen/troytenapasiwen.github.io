export const site = {
  name: "Troy T. Pasiwen",
  role: "Software Developer",
  focus: "Web, Mobile & AI Applications",
  headline: "Software Developer | Web, Mobile & AI Applications",
  subtitle: "BS Information Technology, National University – Manila",
  description:
    "Portfolio of Troy T. Pasiwen, a recent BS Information Technology graduate building web, mobile, and AI applications.",
  url: "https://troytenapasiwen.github.io",
  links: {
    github: "https://github.com/troytenapasiwen",
    linkedin: "https://www.linkedin.com/in/troypasiwen/",
    email: "mailto:troytenapasiwen@gmail.com",
  },
  // Set this to "/resume.pdf" once you add the file to /public
  resume: null as string | null,

  // Short text under the name in the hero
  intro:
    "I'm a recent IT graduate who builds web and mobile software for everyday business workflows. I spent my internship on internal company systems and IT support, and I'm now exploring what locally hosted LLMs can do in practical tools.",

  // Each string becomes one paragraph in the About section
  about: [
    "I'm a BS Information Technology graduate from National University – Manila, specializing in mobile and web applications. For my capstone, a mobile and web delivery platform, I coordinated the project and carried out its functional, integration, accessibility, and security testing.",
    "I then completed an 800-hour software developer internship at Inter-World Shipping Corporation, alongside a concurrent internship at its sister company. The work covered internal business applications, testing, and IT support. I like software that makes a daily process simpler, and testing is a part of the job I take seriously.",
    "I'm especially interested in AI and LLM applications. I use LLM-based tools for coding and debugging, and my AI Resume Analyzer is my first project built around a locally hosted model. I'm early in my career and looking for a role where I can keep learning while contributing to real products.",
  ],
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];