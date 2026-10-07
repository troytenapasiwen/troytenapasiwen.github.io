import { navItems, site } from "@/data/site";

export default function Home() {
  return (
    <>
      <section className="pb-20">
        <p className="font-mono text-xs text-muted">stage 1 / placeholder</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">{site.name}</h1>
        <p className="mt-3 text-muted">{site.headline}</p>
      </section>

      {navItems.map((item, i) => (
        <section
          key={item.id}
          id={item.id}
          aria-labelledby={`${item.id}-heading`}
          className="border-t border-line py-16"
        >
          <p className="font-mono text-xs text-muted">
            {String(i + 1).padStart(2, "0")} / {item.id}
          </p>
          <h2 id={`${item.id}-heading`} className="mt-2 font-serif text-2xl tracking-tight">
            {item.label}
          </h2>
          <p className="mt-4 text-muted">
            Placeholder text. Real content for this section arrives in Stage 2.
          </p>
          <div className="h-64" />
        </section>
      ))}
    </>
  );
}