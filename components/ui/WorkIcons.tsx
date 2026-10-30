/**
 * Small pictograms for work that has no screenshot to show. They are drawings of the kind of work, not
 * pictures of software, and they share one line style (1.6px stroke, rounded, one accent) so they read as a set.
 */
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 72 72",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Recruitment workflow: an applicant, a document under review, and a confirmed outcome. */
export function RecruitmentFlowIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      {/* applicant */}
      <circle cx="14" cy="26" r="5" />
      <path d="M5 44c0-5.5 4-9 9-9s9 3.5 9 9" />
      {/* flow */}
      <path d="M26 36h7" />
      <path d="m31 33 3 3-3 3" />
      {/* document under review */}
      <path d="M38 22h14l5 5v21a2 2 0 0 1-2 2H38a2 2 0 0 1-2-2V24a2 2 0 0 1 2-2Z" />
      <path d="M52 22v5h5" />
      <path d="M41 33h12M41 38h12M41 43h7" />
      {/* outcome */}
      <circle cx="58" cy="56" r="8" className="wi-accent" />
      <path d="m54.5 56 2.5 2.5 4.5-5" className="wi-check" />
    </svg>
  );
}

/** Content and campaign planning: a post with an image, a publishing calendar and a send mark. */
export function ContentPublishIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      {/* the post */}
      <rect x="8" y="12" width="32" height="42" rx="2" />
      <rect x="12" y="16" width="24" height="16" rx="1" />
      <path d="m12 29 6-6 5 5 4-3 9 7" />
      <circle cx="30" cy="21" r="1.6" className="wi-accent-fill" />
      <path d="M12 38h24M12 43h24M12 48h14" />
      {/* the calendar */}
      <rect x="44" y="30" width="20" height="22" rx="2" />
      <path d="M44 37h20M50 27v6M58 27v6" />
      <path d="M49 43h2M55 43h2M49 48h2" />
      <rect x="54" y="46" width="5" height="4" className="wi-accent-fill" stroke="none" />
      {/* publish */}
      <path d="M46 16h12v12" className="wi-accent-stroke" />
      <path d="m46 28 12-12" className="wi-accent-stroke" />
    </svg>
  );
}
