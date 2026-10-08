import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Newsreader({ variable: "--font-newsreader", subsets: ["latin"] });

const ogAlt = `${site.name} | ${site.headline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    title: `${site.name} | ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: ["/og.png"],
  },
};

// Runs before the page paints, so there is no theme flash and no layout jump.
// 1. Applies the saved (or system) colour theme.
// 2. Marks the page as script-enabled ("js") so the writing animations may hide text until it is written.
// 3. Chooses the presentation (data-dm): "static" for reduced motion or the saved Plain view,
//    "cinematic" for large screens, "flow" for everything else. Dossier.tsx keeps it up to date.
const bootScript = `
(function () {
  var d = document.documentElement;
  try {
    var t = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (t === "dark" || (!t && prefersDark)) d.classList.add("dark");
  } catch (e) {}
  d.classList.add("js");
  var mode = "flow";
  try {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var plain = false;
    try { plain = localStorage.getItem("dossier-view") === "plain"; } catch (e) {}
    if (reduced || plain) mode = "static";
    else if (window.matchMedia("(min-width: 1024px) and (min-height: 620px)").matches) mode = "cinematic";
  } catch (e) {}
  d.setAttribute("data-dm", mode);
})();
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  alumniOf: { "@type": "CollegeOrUniversity", name: "National University – Manila" },
  sameAs: [site.links.github, site.links.linkedin],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
