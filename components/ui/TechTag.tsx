// Renders a list item, so always use it inside a <ul>.
export default function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded border border-line px-2 py-0.5 font-mono text-xs text-muted">
      {children}
    </li>
  );
}