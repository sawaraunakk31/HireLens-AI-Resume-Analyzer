import { useCallback } from "react";
import { formatSize } from "../lib/utils";
import { useDropzone } from "react-dropzone";
import { FileText, X } from "lucide-react";

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
  const maxFileSize = 20 * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => onFileSelect?.(acceptedFiles[0] || null),
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  if (file) {
    return (
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.10]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-red-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {file.name}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {formatSize(file.size)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onFileSelect?.(null);
          }}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`relative group cursor-pointer rounded-xl transition-all duration-300 h-full flex flex-col justify-center ${
        isDragActive
          ? "bg-primary/10 border-2 border-primary shadow-[0_0_30px_rgba(77,139,255,0.2)]"
          : "bg-white/2 border border-dashed border-white/12 hover:border-primary/40 hover:bg-white/4"
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragActive
              ? "bg-primary text-white scale-110"
              : "bg-primary/10 text-primary group-hover:bg-primary/20"
          }`}
        >
          <span className="material-symbols-outlined text-2xl">
            {isDragActive ? "file_download" : "cloud_upload"}
          </span>
        </div>

        {/* Text */}
        <div className="space-y-1">
          {isDragActive ? (
            <p className="text-primary font-semibold text-sm">
              Release to upload
            </p>
          ) : (
            <>
              <p className="text-white/80 text-sm font-medium">
                <span className="text-primary">Click to browse</span> or drag &
                drop
              </p>
              <p className="text-white/30 text-xs">PDF only</p>
            </>
          )}
        </div>
      </div>

      {/* Bottom shimmer on hover */}
      {!isDragActive && (
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </div>
  );
};

export default FileUploader;
