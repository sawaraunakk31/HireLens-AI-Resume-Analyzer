import { useState, useCallback } from "react";
import { formatSize } from "../lib/utils";
import { useDropzone } from "react-dropzone";
import { FileText, X } from "lucide-react";

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0] || null;
      onFileSelect?.(selectedFile);
    },
    [onFileSelect],
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div className="w-full relative z-10 group cursor-pointer block">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full h-48 rounded-xl transition-all duration-300 overflow-hidden ${
          isDragActive
            ? "border-2 border-primary bg-primary/10 shadow-[0_0_20px_rgba(77,139,255,0.3)]"
            : file
              ? "border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-[var(--glass-surface)] shadow-[0_0_15px_rgba(0,0,0,0.2)]"
              : "neon-border-dashed bg-[#172236]/30 dark:bg-[var(--glass-surface)]/30 hover:bg-[#172236]/60 dark:hover:bg-[var(--glass-surface)]/60 group-hover:scale-[1.01]"
        }`}
      >
        <input {...getInputProps()} />

        <div className="w-full relative z-10 px-4">
          {file ? (
            <div
              className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl shadow-inner mx-auto max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-left flex flex-col">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="p-2 rounded-full hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onFileSelect?.(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(77,139,255,0.3)]">
                <span className="material-symbols-outlined text-3xl">
                  cloud_upload
                </span>
              </div>
              <h3 className="mb-2 text-sm text-[var(--text-secondary)] font-medium">
                {isDragActive ? (
                  <span className="text-primary font-bold">
                    Drop the file here
                  </span>
                ) : (
                  <>
                    <span className="text-primary font-bold hover:underline">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </>
                )}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] opacity-70">
                PDF format (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>

        {/* Scanning Animation Bar (Simulated) */}
        {!file && (
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[shimmer_2s_infinite]"></div>
        )}
      </div>
    </div>
  );
};
export default FileUploader;
