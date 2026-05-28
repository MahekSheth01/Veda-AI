"use client";

import { useRef, useState } from "react";

import {
  UploadCloud,
  FileText,
  X,
} from "lucide-react";

export default function UploadBox() {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [file, setFile] =
    useState<File | null>(null);

  // FILE CHANGE
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    // VALIDATION
    const validTypes = [
      "application/pdf",
      "text/plain",
    ];

    if (
      !validTypes.includes(selectedFile.type)
    ) {
      alert(
        "Only PDF and TXT files are allowed"
      );

      return;
    }

    setFile(selectedFile);
  };

  // REMOVE FILE
  const removeFile = () => {
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className="
        border-2
        border-dashed
        border-gray-200
        rounded-2xl
        min-h-[240px]
        bg-[#FCFCFC]
        flex
        flex-col
        items-center
        justify-center
        text-center
        px-6
        transition-all
      "
    >

      {/* NO FILE */}
      {!file && (
        <>

          <div
            className="
              w-14
              h-14
              rounded-full
              bg-gray-100
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <UploadCloud
              size={24}
              className="text-gray-500"
            />
          </div>

          <h3 className="text-sm font-medium text-gray-900">
            Choose a file or drag & drop it here
          </h3>

          <p className="text-xs text-gray-400 mt-2">
            PDF or TXT up to 10MB
          </p>

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="
              mt-5
              px-5
              py-2
              rounded-xl
              bg-black
              text-white
              text-sm
              hover:opacity-90
              transition-all
            "
          >
            Browse Files
          </button>

        </>
      )}

      {/* FILE PREVIEW */}
      {file && (
        <div
          className="
            w-full
            max-w-md
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-4
            flex
            items-center
            justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >
              <FileText
                size={18}
                className="text-gray-500"
              />
            </div>

            <div className="text-left">

              <p className="text-sm font-medium">
                {file.name}
              </p>

              <p className="text-xs text-gray-400">
                {(
                  file.size / 1024
                ).toFixed(1)}{" "}
                KB
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={removeFile}
            className="text-red-500"
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* HIDDEN INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

    </div>
  );
}