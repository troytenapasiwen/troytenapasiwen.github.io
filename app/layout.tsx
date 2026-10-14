import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { MIN_SINGLE_HEIGHT, REDUCED_QUERY, SPREAD_QUERY, computeGeometry } from "@/components/dossier/geometry";
import { TIMELINES } from "@/components/dossier/timeline";

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

// Runs before the page paints, so there is no flash and no layout jump.
// 1. Marks the page as script-enabled ("js").
// 2. Chooses the presentation (data-dm): "static" for reduced motion, the saved Plain view or a window too
//    short for a page; "spread" (two pages) for large landscape windows; "single" for everything else.
// 3. Gives the folder its final size and the scroll track its length, using the SAME geometry function
//    Dossier.tsx uses, so the first frame is already correct and hydration changes nothing.
// Dossier.tsx keeps all of this up to date afterwards.
const bootScript = `
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  var mode = "single";
  try {
    var plain = false;
    try { plain = localStorage.getItem("dossier-view") === "plain"; } catch (e) {}
    if (window.matchMedia(${JSON.stringify(REDUCED_QUERY)}).matches || plain) mode = "static";
    else if (window.matchMedia(${JSON.stringify(SPREAD_QUERY)}).matches) mode = "spread";
    else if (window.innerHeight < ${MIN_SINGLE_HEIGHT}) mode = "static";
  } catch (e) {}
  d.setAttribute("data-dm", mode);
  if (mode === "static") return;
  try {
    var g = (${computeGeometry.toString()})(mode, window.innerWidth, window.innerHeight, 0, 0);
    var s = d.style;
    s.setProperty("--pw", g.pw + "px");
    s.setProperty("--ph", g.ph + "px");
    s.setProperty("--ls", g.ls.toFixed(4));
    s.setProperty("--dip", g.dip.toFixed(4));
    s.setProperty("--dy", g.dy + "px");
    s.setProperty("--total", mode === "spread" ? "${TIMELINES.spread.total.toFixed(3)}" : "${TIMELINES.single.total.toFixed(3)}");
  } catch (e) {}
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
