export default function GeneratingLoader() {
  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          p-10
          flex
          flex-col
          items-center
          gap-5
          shadow-2xl
        "
      >

        {/* SPINNER */}
        <div
          className="
            w-14
            h-14
            border-4
            border-gray-200
            border-t-black
            rounded-full
            animate-spin
          "
        />

        <div className="text-center">

          <h2 className="text-xl font-semibold">
            Generating Assignment
          </h2>

          <p className="text-gray-500 mt-2">
            AI is preparing your
            question paper...
          </p>

        </div>

      </div>

    </div>
  );
}