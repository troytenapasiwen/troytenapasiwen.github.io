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
