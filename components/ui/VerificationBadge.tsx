import { BadgeCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { type DogrulamaSeviyesi } from "@/lib/types";

interface Props {
  level: DogrulamaSeviyesi;
  showIconOnly?: boolean;
}

export default function VerificationBadge({ level, showIconOnly = false }: Props) {
  if (level === 1) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: showIconOnly ? "4px" : "4px 10px",
        background: "var(--steel-100)", color: "var(--steel-600)",
        borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
        border: "1px solid var(--steel-200)"
      }}>
        <ShieldAlert size={14} />
        {!showIconOnly && "Kayıtlı"}
      </div>
    );
  }

  if (level === 2) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: showIconOnly ? "4px" : "4px 10px",
        background: "rgba(16, 185, 129, 0.1)", color: "var(--accent-green)",
        borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
        border: "1px solid rgba(16, 185, 129, 0.2)"
      }}>
        <ShieldCheck size={14} />
        {!showIconOnly && "Üye"}
      </div>
    );
  }

  // level 3
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: showIconOnly ? "4px" : "4px 10px",
      background: "rgba(46, 106, 180, 0.1)", color: "var(--navy-500)",
      borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
      border: "1px solid rgba(46, 106, 180, 0.2)"
    }}>
      <BadgeCheck size={14} />
      {!showIconOnly && "Mavi Tikli"}
    </div>
  );
}
