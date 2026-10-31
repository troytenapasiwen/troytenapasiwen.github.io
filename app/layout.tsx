
import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { MIN_SINGLE_HEIGHT, REDUCED_QUERY, SPREAD_QUERY, computeGeometry } from "@/components/dossier/geometry";
import Backdrop from "@/components/ui/Backdrop";

// Display: Archivo Black (cover + headings). Body: DM Sans. Reading: Newsreader (serif, plain edition and statements).
// Technical: IBM Plex Mono. Self-hosted by next/font at
// build time, so there are no runtime requests to Google and no layout shift (fallbacks are size-adjusted).
const display = Archivo_Black({ variable: "--font-archivo", subsets: ["latin"], weight: "400", display: "swap" });
const sans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const serif = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"], display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const ogAlt = `${site.name} | ${site.headline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
 icons: {
  icon: "/portfolio-favicon.png",
  shortcut: "/portfolio-favicon.png",
},
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
// 3. Gives the folder its final size, using the SAME geometry function
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
      className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable}`}
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
        <Backdrop />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
