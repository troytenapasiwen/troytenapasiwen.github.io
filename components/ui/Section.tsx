import { navItems } from "@/data/site";

export default function Section({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const index = navItems.findIndex((item) => item.id === id);
  const label = navItems[index]?.label ?? id;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-line py-16"
    >
      <p className="font-mono text-xs text-muted">
        {String(index + 1).padStart(2, "0")} / {id}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-2 font-serif text-2xl tracking-tight"
      >
        {label}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}