import Image from "next/image";
import type { CSSProperties } from "react";
import { Info, Link2, Lock, MapPin } from "lucide-react";
import Write from "./Write";
import type { Seq } from "./sequence";
import type { Figure, Logo, Note } from "@/data/media";
import { ViewImageButton } from "./ImageViewer";

/**
 * Evidence: real screenshots and the short notes that go with them. Shared by every page that shows project
 * images. All sizes come from the image's own width and height, so nothing is stretched and nothing shifts while
 * the page is being drawn (the space is reserved by the markup, not by the reveal).
 */

/** Screenshots are drawn with a minimal window bar so they read as a screen, not as a loose picture. */
export function Shot({ figure, className = "", priority = false }: { figure: Figure; className?: string; priority?: boolean }) {
  return (
    <span className={`d-shot ${className}`.trim()}>
      <span className="d-shot-bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <Image
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        sizes="(min-width: 1024px) 520px, 90vw"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="d-shot-img"
      />
    </span>
  );
}

/** One screenshot with its caption. */
export function EvidenceFigure({ figure, q }: { figure: Figure; q: Seq }) {
  return (
    <Write as="figure" mode="image" className="d-fig d-fig-view" {...q(80)}>
      <Shot figure={figure} />
      <figcaption className="d-figcap">{figure.caption}</figcaption>
      <ViewImageButton figure={figure} />
    </Write>
  );
}

const noteIcon = { internal: Lock, status: Info, scope: MapPin } as const;

/** A short, quiet note: confidentiality, status or scope. One style for all of them. */
export function NoteBlock({ note, q }: { note: Note; q: Seq }) {
  const Icon = noteIcon[note.tone];
  return (
    <Write as="aside" className="d-note" {...q(note.text.length)}>
      <p className="d-note-label">
        <Icon className="size-3.5" aria-hidden="true" />
        <span>{note.label}</span>
      </p>
      <p className="d-note-text">{note.text}</p>
    </Write>
  );
}

/** A small marker for systems that are connected to one another. */
export function RelationTag({ text, q }: { text: string; q: Seq }) {
  // "Label: what it is connected to" is shown as a bold label followed by the relationship.
  const at = text.indexOf(": ");
  const label = at > 0 ? text.slice(0, at) : null;
  const rest = at > 0 ? text.slice(at + 2) : text;
  return (
    <Write as="p" className="d-relation" {...q(text.length)}>
      <Link2 className="size-3.5" aria-hidden="true" />
      <span>
        {label && <strong>{label}</strong>}
        {label && " · "}
        {rest.charAt(0).toUpperCase() + rest.slice(1)}
      </span>
    </Write>
  );
}

/** Two views of one website: a larger first screen with the second layered over its corner. */
export function SiteShowcase({ figures, q }: { figures: Figure[]; q: Seq }) {
  const [main, second] = figures;
  return (
    <Write as="figure" mode="image" className="d-site" {...q(120)}>
      <span className="d-site-main">
        <Shot figure={main} />
        <span className="d-tagline">{main.caption}</span>
        <ViewImageButton figure={main} />
      </span>
      {second && (
        <span className="d-site-second">
          <Shot figure={second} />
          <span className="d-tagline">{second.caption}</span>
          <ViewImageButton figure={second} />
        </span>
      )}
      <figcaption className="sr-only">Two views of the same website</figcaption>
    </Write>
  );
}

/** One application on two screens: the web view with the phone view standing in front of it. */
export function DeviceShowcase({ web, mobile, q }: { web: Figure; mobile: Figure; q: Seq }) {
  return (
    <Write as="figure" mode="image" className="d-device" {...q(120)}>
      <span className="d-device-web">
        <Shot figure={web} />
        <span className="d-tagline">{web.caption}</span>
        <ViewImageButton figure={web} />
      </span>
      <span className="d-device-phone">
        <span className="d-phone">
          <Image
            src={mobile.src}
            alt={mobile.alt}
            width={mobile.width}
            height={mobile.height}
            sizes="160px"
            loading="lazy"
            decoding="async"
            className="d-phone-img"
          />
        </span>
        <span className="d-tagline">{mobile.caption}</span>
        <ViewImageButton figure={mobile} />
      </span>
      <figcaption className="sr-only">The same application on the web and on a phone</figcaption>
    </Write>
  );
}

/** A phone screenshot in a simple device frame, labelled as the mobile view. */
export function PhoneFigure({ figure, q }: { figure: Figure; q: Seq }) {
  return (
    <Write as="figure" mode="image" className="d-phonefig" {...q(60)}>
      <span className="d-phone">
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          sizes="200px"
          loading="lazy"
          decoding="async"
          className="d-phone-img"
        />
      </span>
      <figcaption className="d-figcap">{figure.caption}</figcaption>
      <ViewImageButton figure={figure} />
    </Write>
  );
}

/**
 * The company or school mark beside a name. Squares and wide logos both fit the same tile: a wide card is zoomed
 * into its mark (never squeezed), a square logo is simply contained.
 */
export function Mark({ logo, className = "" }: { logo: Logo; className?: string }) {
  const crop = logo.crop;
  const style: CSSProperties | undefined = crop
    ? {
        position: "absolute",
        maxWidth: "none",
        width: `${(logo.width / crop.size) * 100}%`,
        left: `${(-(crop.cx - crop.size / 2) / crop.size) * 100}%`,
        top: `${(-(crop.cy - crop.size / 2) / crop.size) * 100}%`,
      }
    : undefined;
  return (
    <span className={`d-mark ${crop ? "d-mark-crop" : ""} ${className}`.trim()}>
      <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} style={style} loading="eager" />
    </span>
  );
}
