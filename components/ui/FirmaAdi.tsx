import { BadgeCheck, Lock } from "lucide-react";

interface Props {
  name: string;
  userTier: number;
  hasBlueTick: boolean;
  blurTargetLevel?: number; // Minimum tier required to NOT see blur (default: 2)
}

export default function FirmaAdi({ name, userTier, hasBlueTick, blurTargetLevel = 2 }: Props) {
  const isBlurred = userTier < blurTargetLevel;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span className={isBlurred ? "blur-mask" : ""} style={{ fontWeight: 600, color: "var(--navy-800)", display: "inline-block" }}>
        {name}
      </span>
      {isBlurred && (
        <span style={{ 
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "var(--steel-100)", color: "var(--steel-500)",
          padding: "2px", borderRadius: "4px"
        }}>
          <Lock size={12} />
        </span>
      )}
      {!isBlurred && hasBlueTick && (
        <BadgeCheck size={16} color="var(--navy-400)" fill="rgba(46, 106, 180, 0.1)" />
      )}
    </div>
  );
}
