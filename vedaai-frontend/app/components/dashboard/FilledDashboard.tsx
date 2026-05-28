import { Search, Filter } from "lucide-react";
import AssignmentCard from "./AssignmentCard";

export default function FilledDashboard() {
  return (
    <div
      className="
        flex-1
        bg-[#F8F8F8]
        rounded-2xl
        p-6
        flex
        flex-col
        gap-6
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Assignments
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage and create assignments
          </p>
        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div className="flex items-center gap-4">

        {/* FILTER */}
        <button
          className="
            h-11
            px-4
            rounded-xl
            bg-white
            border
            border-gray-200
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <Filter size={16} />

          Filter
        </button>

        {/* SEARCH */}
        <div
          className="
            flex-1
            h-11
            bg-white
            rounded-xl
            border
            border-gray-200
            px-4
            flex
            items-center
            gap-2
          "
        >
          <Search size={16} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search Assignment"
            className="
              flex-1
              outline-none
              text-sm
              bg-transparent
            "
          />
        </div>

      </div>

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        "
      >

        {Array.from({ length: 6 }).map((_, i) => (
          <AssignmentCard 
            key={i} 
            assignment={{ 
              _id: `mock-${i}`, 
              createdAt: '2025-06-20T00:00:00.000Z', 
              dueDate: '2025-06-21T00:00:00.000Z', 
              subject: 'Quiz on Electricity', 
              schoolName: 'Delhi Public School' 
            } as any} 
          />
        ))}

      </div>

    </div>
  );
}