"use client";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAssignmentStore, AssignmentRecord } from "../../store/assignmentStore";
interface Props { assignment: AssignmentRecord; }
export default function AssignmentCard({ assignment }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { removeAssignment, setCurrentView } = useAssignmentStore();
  const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };
  const assignedDate = formatDate(assignment.createdAt);
  const dueDate = assignment.dueDate ? formatDate(assignment.dueDate) : "—";
  const title = assignment.subject
    ? `${assignment.subject} – ${assignment.schoolName}`
    : assignment.schoolName || "Assignment";
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-sm transition-shadow relative">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {title}
        </h3>
        {/* 3-DOT MENU */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 min-w-[150px]">
                <button
                  onClick={() => { setMenuOpen(false); setCurrentView("output"); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye size={14} />
                  View Assignment
                </button>
                <button
                  onClick={() => { setMenuOpen(false); removeAssignment(assignment._id); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* DATES */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-xs text-gray-500">
          Assigned on: <span className="font-medium text-gray-700">{assignedDate}</span>
        </span>
        <span className="text-gray-300 text-xs hidden sm:block">|</span>
        <span className="text-xs text-gray-500">
          Due: <span className="font-medium text-gray-700">{dueDate}</span>
        </span>
      </div>
    </div>
  );
}
