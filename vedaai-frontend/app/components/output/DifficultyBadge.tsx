interface DifficultyBadgeProps {
  difficulty: string;
}
export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {

  const normalised = difficulty?.toLowerCase().trim();

  const resolvedKey =
    normalised === "moderate" ? "medium" : normalised;
  const colorMap: Record<string, string> = {
    easy: "bg-[#181818] text-white",
    medium: "bg-[#181818] text-white",
    hard: "bg-[#181818] text-white",
  };
  const colorClass =
    colorMap[resolvedKey] ?? "bg-[#181818] text-white";

    const label =
    difficulty
      ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
      : "Unknown";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
