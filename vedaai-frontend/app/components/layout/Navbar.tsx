"use client";
import { Bell, ChevronDown, ArrowLeft } from "lucide-react";
import { useAssignmentStore } from "../../store/assignmentStore";
const VIEW_LABELS: Record<string, string> = {
  dashboard: "Assignment",
  create:    "Assignment",
  output:    "Assignment",
};
export default function Navbar() {
  const { currentView, setCurrentView } = useAssignmentStore();
  const showBack = currentView !== "dashboard";
  return (

<header className="bg-white border-b border-gray-100 h-[56px] flex items-center px-5 gap-3 shrink-0 sticky top-0 z-30">
      {/* LEFT — breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {showBack && (
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          </svg>
          <span className="text-[13px] text-gray-500">{VIEW_LABELS[currentView]}</span>
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex items-center gap-2 shrink-0">
        {/* BELL */}
        <button className="relative w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
          <Bell size={17} className="text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        {/* DIVIDER */}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {/* USER */}
        <button className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-xs font-semibold text-orange-800 shrink-0">
            JD
          </div>
          <span className="text-[13px] font-medium text-gray-700">John Doe</span>
          <ChevronDown size={13} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
