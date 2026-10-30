import { TechChip } from "./TechChip";

// Renders a list item, so always use it inside a <ul>.
export default function TechTag({ children }: { children: string }) {
  return (
    <li className="border border-rule bg-paper px-2.5 py-1 text-sm text-fg">
      <TechChip name={children} />
    </li>
  );
}
