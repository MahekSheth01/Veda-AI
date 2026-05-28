"use client";

import {
  Plus,
  SlidersHorizontal,
  Search,
} from "lucide-react";

import { useState } from "react";

import {
  useAssignmentStore,
} from "../../store/assignmentStore";

import AssignmentCard from "./AssignmentCard";

// ─────────────────────────────────────────────────────────────
// EMPTY STATE ILLUSTRATION
// ─────────────────────────────────────────────────────────────

function EmptyIllustration() {

  return (
    <svg
      width="180"
      height="160"
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      <circle
        cx="82"
        cy="75"
        r="52"
        fill="#F3F4F6"
      />

      <circle
        cx="82"
        cy="75"
        r="36"
        fill="white"
        stroke="#E5E7EB"
        strokeWidth="2"
      />

      <line
        x1="108"
        y1="101"
        x2="138"
        y2="132"
        stroke="#D1D5DB"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <circle
        cx="82"
        cy="75"
        r="14"
        fill="#FEE2E2"
      />

      <line
        x1="74"
        y1="67"
        x2="90"
        y2="83"
        stroke="#EF4444"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <line
        x1="90"
        y1="67"
        x2="74"
        y2="83"
        stroke="#EF4444"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────

export default function DashboardPage() {

  const {
    assignments,
    setCurrentView,
  } = useAssignmentStore();

  const [search, setSearch] =
    useState("");

  const filtered =
    assignments.filter((a) =>
      `${a.subject} ${a.schoolName}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ───────────────────────────────────────────────────────────
  // EMPTY STATE
  // ───────────────────────────────────────────────────────────

  if (assignments.length === 0) {

    return (

      <div
        className="
          bg-white
          rounded-[32px]
          border
          border-[#ECECEC]
          shadow-[0_8px_30px_rgba(0,0,0,0.03)]
          h-full
          min-h-[calc(100vh-120px)]
          flex
          items-center
          justify-center
          px-6
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            text-center
            max-w-[540px]
          "
        >

          <EmptyIllustration />

          <h1
            className="
              mt-8
              text-[30px]
              leading-none
              font-semibold
              text-[#121212]
            "
          >
            No assignments yet
          </h1>

          <p
            className="
              mt-4
              text-[15px]
              leading-7
              text-[#6B7280]
            "
          >
            Create your first assignment
            to start collecting and grading
            student submissions.
            You can set up rubrics,
            define marking criteria,
            and let AI assist with grading.
          </p>

          <button
            onClick={() =>
              setCurrentView(
                "create"
              )
            }
            className="
              mt-8
              h-[50px]
              px-7
              rounded-full
              bg-[#121212]
              text-white
              text-[14px]
              font-medium
              flex
              items-center
              gap-2
              shadow-lg
              hover:bg-black
              transition-all
            "
          >

            <Plus
              size={16}
              strokeWidth={2.5}
            />

            Create Your First Assignment

          </button>

        </div>

      </div>
    );
  }

  // ───────────────────────────────────────────────────────────
  // FILLED STATE
  // ───────────────────────────────────────────────────────────

  return (

    <div
      className="
        bg-white
        rounded-[32px]
        border
        border-[#ECECEC]
        shadow-[0_8px_30px_rgba(0,0,0,0.03)]
        min-h-[calc(100vh-120px)]
        p-7
      "
    >

      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-[30px]
              font-semibold
              text-[#121212]
            "
          >
            Assignments
          </h1>

          <p
            className="
              mt-2
              text-[14px]
              text-[#6B7280]
            "
          >
            Manage and create
            assignments for your classes.
          </p>

        </div>

        <button
          onClick={() =>
            setCurrentView(
              "create"
            )
          }
          className="
            h-[48px]
            px-6
            rounded-full
            bg-[#121212]
            text-white
            text-[14px]
            font-medium
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
            hover:bg-black
            transition-all
            w-full
            sm:w-auto
          "
        >

          <Plus
            size={16}
            strokeWidth={2.5}
          />

          Create Assignment

        </button>

      </div>

      {/* FILTERS */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-4
          mb-8
        "
      >

        {/* FILTER BUTTON */}
        <button
          className="
            h-[46px]
            px-4
            rounded-2xl
            border
            border-[#ECECEC]
            bg-[#FAFAFA]
            text-[13px]
            text-[#6B7280]
            font-medium
            flex
            items-center
            gap-2
            hover:bg-[#F5F5F5]
            transition-colors
            w-full
            sm:w-auto
          "
        >

          <SlidersHorizontal
            size={16}
          />

          Filter by

        </button>

        {/* SEARCH */}
        <div
          className="
            relative
            w-full
            sm:max-w-[320px]
          "
        >

          <Search
            size={16}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search Assignment"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              h-[46px]
              pl-11
              pr-4
              rounded-2xl
              border
              border-[#ECECEC]
              bg-[#FAFAFA]
              text-[13px]
              outline-none
              focus:border-gray-300
              transition-colors
            "
          />

        </div>

      </div>

      {/* ASSIGNMENT GRID */}
      {filtered.length > 0 ? (

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
          "
        >

          {filtered.map((a) => (
            <AssignmentCard
              key={a._id}
              assignment={a}
            />
          ))}

        </div>

      ) : (

        <div
          className="
            py-24
            text-center
            text-[#9CA3AF]
            text-[14px]
          "
        >
          No assignments found.
        </div>

      )}

    </div>
  );
}