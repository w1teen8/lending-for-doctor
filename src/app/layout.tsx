import type { ReactNode } from "react";

// Pass-through: <html> is rendered by app/[locale]/layout.tsx so it can carry lang.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
