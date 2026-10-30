import { TechChip } from "./TechChip";
import type { TechStack } from "@/data/media";

/** The groups of a stack that actually have something in them, in a fixed order. Empty groups are never shown. */
export function stackGroups(stack: TechStack) {
  const groups: { key: "frontend" | "backend" | "deployment"; title: string; items: { name: string; scope?: string }[] }[] = [];
  if (stack.frontend?.length) groups.push({ key: "frontend", title: "Frontend", items: stack.frontend.map((name) => ({ name })) });
  if (stack.backend?.length) groups.push({ key: "backend", title: "Backend", items: stack.backend.map((name) => ({ name })) });
  if (stack.deployment?.length) groups.push({ key: "deployment", title: "Deployment", items: stack.deployment });
  return groups;
}

/** A technology chip, followed by what part it covers when that is only a part (e.g. "Render, Backend"). */
export function StackItem({ name, scope, scopeClass }: { name: string; scope?: string; scopeClass: string }) {
  return (
    <>
      <TechChip name={name} />
      {scope && <span className={scopeClass}>{` — ${scope}`}</span>}
    </>
  );
}
