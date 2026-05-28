"use client";
import { Home } from "lucide-react";
import { useAssignmentStore } from "../../store/assignmentStore";

const items = [
  { icon: Home, label: "Home", view: "dashboard" as const },
  { img: "/Calendar.png", label: "Assignments", view: "dashboard" as const },
  { img: "/file-text_plus.png", label: "Library" },
  { img: "/Frame 1618872409 (1).png", label: "AI Toolkit" },
];

export default function MobileNav() {
  const { currentView, setCurrentView } = useAssignmentStore();
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive =
            item.label === "Assignments" || item.label === "Home"
              ? currentView === "dashboard"
              : false;
              
          return (
            <button
              key={item.label}
              onClick={() => item.view && setCurrentView(item.view)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                isActive ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {item.icon ? (
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={isActive ? "text-blue-600" : "text-gray-400"}
                />
              ) : (
                <img 
                  src={item.img} 
                  alt={item.label} 
                  className={`w-5 h-5 object-contain ${!isActive ? "opacity-50 grayscale" : ""}`} 
                />
              )}
              <span className={`text-[10px] font-medium ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
