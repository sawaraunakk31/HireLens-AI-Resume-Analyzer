import { useCallback } from "react";
import { formatSize } from "../lib/utils";
import { useDropzone } from "react-dropzone";
import { FileText, X, ShieldCheck, Zap, BarChart3 } from "lucide-react";

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

  const maxFileSize = 20 * 1024 * 1024; // 20MB

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
        className={`relative flex flex-col items-center justify-center w-full rounded-xl transition-all duration-300 overflow-hidden ${
          isDragActive
            ? "border-2 border-primary bg-primary/10 shadow-[0_0_20px_rgba(77,139,255,0.3)] min-h-[180px]"
            : file
              ? "border border-[var(--glass-border)] bg-[var(--glass-surface)] min-h-[80px]"
              : "neon-border-dashed bg-[#172236]/30 dark:bg-[var(--glass-surface)]/30 hover:bg-[#172236]/60 dark:hover:bg-[var(--glass-surface)]/60 group-hover:scale-[1.01] min-h-[180px]"
        }`}
      >
        <input {...getInputProps()} />

        <div className="w-full relative z-10 px-6 py-5">
          {file ? (
            /* File selected — compact pill */
            <div
              className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl shadow-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left flex flex-col">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[220px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                    {formatSize(file.size)} · PDF
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
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : isDragActive ? (
            /* Drag active */
            <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
              <div className="p-4 rounded-full bg-primary text-white shadow-[0_0_20px_rgba(77,139,255,0.5)]">
                <span className="material-symbols-outlined text-4xl">
                  cloud_upload
                </span>
              </div>
              <p className="text-primary font-bold text-base">
                Drop your resume here
              </p>
            </div>
          ) : (
            /* Default empty state */
            <div className="flex flex-col items-center text-center gap-4">
              {/* Upload icon + CTA */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(77,139,255,0.2)]">
                  <span className="material-symbols-outlined text-3xl">
                    cloud_upload
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    <span className="text-primary font-bold">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-60 mt-0.5">
                    PDF only · max {formatSize(maxFileSize)}
                  </p>
                </div>
              </div>

              {/* Feature strip */}
              <div className="w-full border-t border-[var(--glass-border)] pt-3 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    Instant AI scan
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    ATS score
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    Private & secure
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shimmer on hover */}
        {!file && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[shimmer_2s_infinite]"></div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
