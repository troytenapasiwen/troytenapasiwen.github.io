import { StackItem, stackGroups } from "@/components/ui/TechStack";
import type { TechStack } from "@/data/media";

/** Technologies for the plain edition, grouped as Frontend / Backend / Deployment. Empty groups are skipped. */
export default function PlainStack({ stack, label }: { stack: TechStack; label: string }) {
  return (
    <>
      {stackGroups(stack).map((group) => (
        <div key={group.key} className="pe-stack-group">
          <h5 className="pe-h5">{group.title}</h5>
          <ul className="pe-chips" aria-label={`${group.title}: ${label}`}>
            {group.items.map((item) => (
              <li key={item.name}>
                <StackItem name={item.name} scope={item.scope} scopeClass="pe-muted" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
