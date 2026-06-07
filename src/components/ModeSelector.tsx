import { MODES, type ModeKey } from "../modes";

type Props = {
  value: ModeKey;
  onChange: (m: ModeKey) => void;
};

const ICONS: Record<ModeKey, string> = {
  light:      "☀️",
  dark:       "🌙",
  aurora:     "🌈",
  snow:       "❄️",
  fireflies:  "✨",
  galaxy:     "🌌",
  fog:        "💨",
};

export default function ModeSelector({ value, onChange }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        right: "24px",
        bottom: "24px",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {MODES.map((m) => {
        const active = m === value;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            title={m}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              background: active
                ? "rgba(0, 255, 224, 0.12)"
                : "rgba(13, 11, 38, 0.75)",
              border: active
                ? "1px solid var(--glow-teal)"
                : "1px solid rgba(77, 159, 255, 0.12)",
              boxShadow: active
                ? "0 0 20px rgba(0, 255, 224, 0.2), inset 0 0 12px rgba(0, 255, 224, 0.05)"
                : "none",
              transform: active ? "scale(1.12)" : "scale(1)",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
          >
            {ICONS[m]}
          </button>
        );
      })}
    </div>
  );
}
