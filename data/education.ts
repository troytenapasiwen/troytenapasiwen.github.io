import type { Logo } from "./media";

export const education = [
  {
    degree: "Bachelor of Science in Information Technology",
    school: "National University – Manila",
    specialization: "Specialization in Mobile and Web Applications",
    period: "Aug 2022 – Sept 2026",
    honors: "Magna Cum Laude",
  },
];

export const educationMedia: {
  logo: Logo;
  photo: { src: string; alt: string; width: number; height: number };
} = {
  logo: { src: "/images/NUUU.webp", alt: "National University logo", width: 2158, height: 696 },
  photo: {
    src: "/images/grad.jpg",
    alt: "Troy Pasiwen in a graduation gown with a red stole, photographed against a dark blue backdrop.",
    width: 1852,
    height: 2355,
  },
};
