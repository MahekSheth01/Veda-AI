"use client";
import { Home, Users, FileText, BookOpen, Library, Settings, Sparkles } from "lucide-react";
import { useAssignmentStore } from "../../store/assignmentStore";
interface NavItem {
  icon?: React.ElementType;
  img?: string;
  label: string;
  view?: "dashboard" | "create" | "output";
}
const navItems: NavItem[] = [
  { icon: Home,     label: "Home",               view: "dashboard" },
  { icon: Users,    label: "My Groups" },
  { icon: FileText, label: "Assignments",         view: "dashboard" },
  { img: "/Frame 1618872409 (1).png", label: "AI Teacher's Toolkit" },
  { icon: Library,  label: "My Library" },
];
export default function Sidebar() {
  const { currentView, setCurrentView, assignments } = useAssignmentStore();
  const isActive = (item: NavItem) => {
    if (item.label === "Assignments") {
      return currentView === "dashboard" || currentView === "create" || currentView === "output";
    }
    return false;
  };
  return (

<aside className="w-[304px] min-h-screen bg-white flex flex-col justify-between shrink-0 border-r border-gray-100">
      {/* TOP */}
      <div className="flex flex-col gap-0 px-5 pt-5">

        <div className="flex items-center gap-3.5 mb-8">
          <img src="/logo.png" alt="VedaAI Logo" className="w-[56px] h-[56px] object-contain" />
          <span className="text-[32px] font-extrabold text-gray-900 tracking-tight">VedaAI</span>
        </div>

        <button
          onClick={() => setCurrentView("create")}
          className="flex items-center justify-center gap-2 w-full h-[54px] rounded-full text-white text-[16px] font-medium hover:bg-[#404040] transition-colors mb-8"
          style={{
            border: "4px solid transparent",
            backgroundImage: "linear-gradient(#303030, #303030), linear-gradient(180deg, #FF7950 0%, #C0350A 100%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <img src="/Frame 1618872409 (1).png" alt="Create" className="w-5 h-5 object-contain" />
          <span>Create Assignment</span>
        </button>
        {/* NAV ITEMS */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.label}
                onClick={() => item.view && setCurrentView(item.view)}
                className={`flex items-center gap-3 w-full px-3 h-10 rounded-xl text-[13px] font-medium transition-colors text-left ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                style={item.label === "AI Teacher's Toolkit" ? {
                  border: "4px solid transparent",
                  backgroundImage: active
                    ? "linear-gradient(#f3f4f6, #f3f4f6), linear-gradient(180deg, #FF7950 0%, #C0350A 100%)"
                    : "linear-gradient(#ffffff, #ffffff), linear-gradient(180deg, #FF7950 0%, #C0350A 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                } : {}}
              >
                {item.icon ? (
                  <item.icon size={16} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                ) : (
                  <img src={item.img} alt={item.label} className="w-4 h-4 object-contain shrink-0" />
                )}
                <span className="flex-1">{item.label}</span>
                {item.label === "Assignments" && assignments.length > 0 && (
                  <span className="bg-blue-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {assignments.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      {/* BOTTOM */}
      <div className="px-5 pb-5 flex flex-col gap-3">
        {/* SETTINGS */}
        <button className="flex items-center gap-2.5 h-8 text-[13px] text-gray-500 hover:text-gray-700 transition-colors px-3">
          <Settings size={15} />
          <span>Settings</span>
        </button>

        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-3 py-3">
          <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-sm font-semibold text-orange-800 shrink-0">
            DP
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">Delhi Public School</p>
            <p className="text-[11px] text-gray-500 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
