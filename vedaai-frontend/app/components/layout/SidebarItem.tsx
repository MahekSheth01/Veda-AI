import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export default function SidebarItem({
  icon: Icon,
  label,
  active,
}: SidebarItemProps) {
  return (
    <button
      className={`
        w-full
        h-[38px]
        px-3
        flex
        items-center
        gap-3
        rounded-xl
        text-sm
        transition-all
        duration-200

        ${
          active
            ? "bg-gray-100 text-black font-medium"
            : "text-gray-500 hover:bg-gray-50"
        }
      `}
    >
      <Icon size={16} />

      <span>{label}</span>
    </button>
  );
}