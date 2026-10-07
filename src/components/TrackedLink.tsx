"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = {
  href: string;
  event: AnalyticsEvent;
  label?: string;
  external?: boolean;
  internal?: boolean;
  className?: string;
  children: ReactNode;
};

export function TrackedLink({ href, event, label, external, internal, className, children }: Props) {
  const onClick = () => track(event, label ? { label } : undefined);
  if (internal) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
