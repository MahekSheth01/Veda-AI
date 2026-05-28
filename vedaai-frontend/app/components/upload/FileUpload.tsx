"use client";

import { Upload, X } from "lucide-react";

interface FileUploadProps {
  file: File | null;

  setFile: (
    file: File | null
  ) => void;
}

export default function FileUpload({
  file,
  setFile,
}: FileUploadProps) {

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    // VALIDATION
    const allowedTypes = [
      "application/pdf",
      "text/plain",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      alert(
        "Only PDF or TXT files are allowed."
      );

      return;
    }

    setFile(selectedFile);
  };

  return (
    <div>

      {!file ? (

        <label
          className="
            border-2
            border-dashed
            border-gray-300
            rounded-3xl
            p-10
            flex
            flex-col
            items-center
            justify-center
            cursor-pointer
            hover:border-black
            transition
            bg-[#FAFAFA]
          "
        >

          <Upload
            size={42}
            className="text-gray-400"
          />

          <h3
            className="
              mt-5
              text-lg
              font-semibold
            "
          >
            Upload PDF or TXT
          </h3>

          <p
            className="
              text-sm
              text-gray-500
              mt-2
            "
          >
            Drag & drop or click
            to upload file
          </p>

          <input
            type="file"
            accept=".pdf,.txt"
            onChange={
              handleFileChange
            }
            className="hidden"
          />

        </label>

      ) : (

        <div
          className="
            border
            border-gray-200
            rounded-3xl
            p-5
            flex
            items-center
            justify-between
            bg-white
          "
        >

          <div>

            <p className="font-medium">
              {file.name}
            </p>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              {(
                file.size /
                1024
              ).toFixed(2)}{" "}
              KB
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setFile(null)
            }
            className="
              text-red-500
            "
          >
            <X size={20} />
          </button>

        </div>

      )}

    </div>
  );
}