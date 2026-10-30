import { Fragment, type CSSProperties } from "react";
import { timing } from "./Write";
import type { Seq } from "./sequence";
import { Caption } from "./ui";
import { StackItem, stackGroups } from "@/components/ui/TechStack";
import type { TechStack } from "@/data/media";

/**
 * Technologies for the folder view, grouped as Frontend / Backend / Deployment.
 * Each group is drawn like the existing technology list (same chips, same reveal); empty groups are skipped.
 */
export function StackList({ stack, label, q }: { stack: TechStack; label: string; q: Seq }) {
  return (
    <>
      {stackGroups(stack).map((group) => {
        const { dl, du } = q(24);
        return (
          <Fragment key={group.key}>
            <Caption q={q}>{group.title}</Caption>
            <ul className="write write-stagger write-chips d-tags" style={timing(dl, du)} aria-label={`${group.title}: ${label}`}>
              {group.items.map((item, i) => (
                <li key={item.name} className="d-tag" style={{ "--n": i } as CSSProperties}>
                  <StackItem name={item.name} scope={item.scope} scopeClass="d-muted" />
                </li>
              ))}
            </ul>
          </Fragment>
        );
      })}
    </>
  );
}
