"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import type { Figure } from "@/data/media";

/**
 * "View image": a small, lightweight viewer for the real screenshots.
 *
 *   - The enlarged image is only put on the page when the viewer is opened, so nothing large is fetched in advance.
 *   - While it is open, <html data-viewer> is set. Dossier.tsx reads it and ignores wheel, touch, keyboard and
 *     arrow-button input, so using the viewer can never turn a page. Opening and closing it changes no dossier state.
 *   - It is a modal dialog: focus moves to the close button, Tab stays inside, Escape or a click on the dark
 *     backdrop closes it, and focus returns to the button that opened it.
 */

function Viewer({ figure, onClose, opener }: { figure: Figure; onClose: () => void; opener: RefObject<HTMLButtonElement | null> }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const back = opener.current;
    html.setAttribute("data-viewer", "open");
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === "Tab") {
        e.preventDefault(); // the close button is the only control inside
        closeRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      html.removeAttribute("data-viewer");
      back?.focus({ preventScroll: true });
    };
  }, [onClose, opener]);

  return createPortal(
    <div
      className="d-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${figure.caption}, enlarged image`}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="d-lightbox-close" onClick={onClose} aria-label="Close image viewer">
        <X className="size-4" aria-hidden="true" />
        <span>Close</span>
      </button>
      <figure className="d-lightbox-fig">
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          sizes="100vw"
          loading="eager"
          decoding="async"
          className="d-lightbox-img"
        />
        <figcaption className="d-lightbox-cap">{figure.caption}</figcaption>
      </figure>
    </div>,
    document.body,
  );
}

/** The "View image" action that sits with a screenshot. */
export function ViewImageButton({ figure }: { figure: Figure }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        ref={opener}
        type="button"
        className="d-viewbtn"
        aria-haspopup="dialog"
        aria-label={`View image: ${figure.caption}`}
        onClick={() => setOpen(true)}
      >
        <Maximize2 className="size-3.5" aria-hidden="true" />
        <span>View image</span>
      </button>
      {open && <Viewer figure={figure} onClose={close} opener={opener} />}
    </>
  );
}
