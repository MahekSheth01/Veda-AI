export default function EmptyState() {
  return (
    <div
      className="
        flex-1
        bg-[#F8F8F8]
        rounded-2xl
        flex
        flex-col
        items-center
        justify-center
        text-center
      "
    >
      <div className="w-40 h-40 rounded-full bg-gray-200 mb-6" />

      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        No assignments yet
      </h2>

      <p className="text-sm text-gray-500 max-w-md mb-6">
        Create your first assignment to start collecting and grading student submissions.
      </p>

      <button
        className="
          px-6
          py-3
          rounded-full
          bg-black
          text-white
          text-sm
        "
      >
        + Create Your First Assignment
      </button>
    </div>
  );
}