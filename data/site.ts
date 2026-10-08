export const site = {
  name: "Troy Pasiwen",
  role: "Software Developer",
  focus: "Web, Mobile & AI",
  headline: "Software Developer | Web, Mobile & AI",
  subtitle: "BS Information Technology, National University – Manila",
  description:
    "Portfolio of Troy Pasiwen, a recent BS Information Technology graduate with hands-on experience in web and mobile development, software testing, and business applications.",
  url: "https://troytenapasiwen.github.io",
  domain: "troytenapasiwen.github.io",
  handle: "troytenapasiwen",
  links: {
    github: "https://github.com/troytenapasiwen",
    linkedin: "https://www.linkedin.com/in/troypasiwen/",
    email: "mailto:troytenapasiwen@gmail.com",
  },
  emailAddress: "troytenapasiwen@gmail.com",
  // Set this to "/resume.pdf" once you add the file to /public
  resume: null as string | null,

  intro:
    "I’m a recent Information Technology graduate specializing in mobile and web applications, with hands-on experience building and testing web and mobile software. I’m also exploring LLM applications and AI-assisted development, including a locally hosted AI Resume Analyzer built with Python and Llama 3.2.",

  about: [
    "I’m a BS Information Technology graduate from National University – Manila, specializing in Mobile and Web Applications. My experience spans web and mobile development, software testing, UI/UX, databases, and business workflow applications.",
    "During my internship, I worked on multiple business systems, including an Inventory Management System, Crewing Management System, Automated Forms Portal, and a company news website with an integrated CMS. I contributed to development, testing, UI/UX, application workflows, and IT support, while independently developing the Automated Forms Portal.",
    "Outside of professional work, I’ve been building projects to deepen my development skills. My current focus includes locally hosted LLM applications and AI-assisted development, with a particular interest in how these tools can support practical software solutions.",
  ],
};

// Order matches the dossier: About → Experience → Projects → Education → Skills → Contact.
// `title` is the heading used inside the dossier; `label` is the short navigation label.
export const navItems = [
  { id: "about", label: "About", title: "Introduction" },
  { id: "experience", label: "Experience", title: "Experience" },
  { id: "projects", label: "Projects", title: "Projects" },
  { id: "education", label: "Education", title: "Education" },
  { id: "skills", label: "Skills", title: "Skills" },
  { id: "contact", label: "Contact", title: "Contact" },
];
