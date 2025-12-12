import { MODES, type ModeKey } from "../modes";

type Props = {
  value: ModeKey;
  onChange: (m: ModeKey) => void;
};

const ICONS: Record<ModeKey, string> = {
  light: "☀️",
  dark: "🌙",
  aurora: "🌈",
  snow: "❄️",
  fireflies: "✨",
  galaxy: "🌌",
  fog: "💨",
};

export default function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="flex flex-col gap-2 items-center">
        {MODES.map((m) => {
          const active = m === value;
          return (
            <button
              key={m}
              onClick={() => onChange(m)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg
                transition-transform duration-200
                ${active ? "scale-110 ring-4 ring-sky-300/30" : "hover:scale-105"}
                ${active ? "bg-sky-500 text-white" : "bg-white/6 text-white"}
              `}
              title={m}
            >
              <span style={{ filter: active ? "drop-shadow(0 4px 8px rgba(59,130,246,0.35))" : "none" }}>
                {ICONS[m]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
