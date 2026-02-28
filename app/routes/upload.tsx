import { prepareInstructions } from "constants/index";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }): Promise<void> => {
    try {
      setIsProcessing(true);
      setErrorMsg("");
      setStatusText("Uploading the file...");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) {
        setErrorMsg("Failed to upload file");
        return setIsProcessing(false);
      }
      setStatusText("Converting to image...");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) {
        console.error("PDF conversion error:", imageFile.error);
        setErrorMsg("Failed to convert pdf to image");
        return setIsProcessing(false);
      }
      setStatusText("Uploading the image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) {
        setErrorMsg("Failed to upload image");
        return setIsProcessing(false);
      }
      setStatusText("Preparing data...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analyzing the resume...");
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription }),
      );
      if (!feedback) {
        setErrorMsg("Error: Failed to analyze resume");
        return setIsProcessing(false);
      }

      let feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      feedbackText = feedbackText.replace(/```json\n?|```/g, "").trim();

      try {
        data.feedback = JSON.parse(feedbackText);
      } catch (parseError) {
        console.error("Failed to parse AI feedback JSON:", feedbackText);
        setErrorMsg(
          `Error: AI returned invalid response format. It replied: ${feedbackText.substring(0, 100)}...`,
        );
        return setIsProcessing(false);
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete, redirecting...");
      navigate(`/resume/${uuid}`);
    } catch (error) {
      console.error("Analysis process failed deep log:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        setErrorMsg(`An unexpected error occurred: ${error.message}`);
      } else {
        setErrorMsg("An unexpected error occurred during analysis");
      }
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file }).catch(
      (err) => {
        console.error("handleAnalyze failed:", err);
      },
    );
  };

  return (
    <div className="font-body min-h-screen flex flex-col overflow-x-hidden">
      {/* Grid background */}
      <div
        className="fixed inset-0 z-0 opacity-10 dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, #4d8bff 1px, transparent 1px), linear-gradient(to bottom, #4d8bff 1px, transparent 1px)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full grow">
        <Navbar />

        <main className="flex-1 flex justify-center py-8 lg:py-12 px-4 sm:px-6">
          <div className="flex flex-col w-full max-w-[1000px] gap-6">
            {/* Page title */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI Powered Analysis
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
                <span className="text-white">Analyze Your </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  Resume
                </span>
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">
                Upload your resume for a general AI analysis — or add job
                details for a targeted score.
              </p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-red-400 font-medium">{errorMsg}</p>
                <button
                  onClick={() => setErrorMsg("")}
                  className="mt-2 text-sm text-[var(--text-secondary)] hover:text-white underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Processing */}
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center gap-6 py-12">
                <h2 className="text-2xl text-white font-semibold animate-pulse">
                  {statusText}
                </h2>
                <div className="relative aspect-[4/3] w-full max-w-md rounded-3xl overflow-hidden glass-panel-heavy p-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite] z-20" />
                  <img
                    src="/images/resume-scan.gif"
                    alt="Scanning"
                    className="w-full h-full object-cover mix-blend-luminosity dark:mix-blend-screen opacity-80 z-10"
                  />
                </div>
              </div>
            ) : (
              /* Main form */
              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="glass-panel-heavy rounded-2xl p-8 relative overflow-hidden"
              >
                {/* Glows */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

                {/* 50 / 50 split */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ── LEFT: Upload ── */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-xl">
                          upload_file
                        </span>
                        Upload Resume
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm">
                        Drop your PDF resume here to get started.
                      </p>
                    </div>

                    <FileUploader file={file} onFileSelect={handleFileSelect} />

                    <button
                      type="submit"
                      disabled={!file}
                      className="relative overflow-hidden group w-full bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(77,139,255,0.4)] hover:shadow-[0_0_30px_rgba(77,139,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="material-symbols-outlined text-[20px]">
                        auto_awesome
                      </span>
                      <span>Analyze Resume</span>
                    </button>
                  </div>

                  {/* ── RIGHT: Job Context ── */}
                  <div className="flex flex-col gap-4 lg:pl-8 lg:border-l lg:border-[var(--glass-border)]">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-xl">
                          work
                        </span>
                        Job Context
                        <span className="text-[11px] font-normal text-[var(--text-secondary)] border border-[var(--glass-border)] px-2 py-0.5 rounded-full ml-1">
                          Optional
                        </span>
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm">
                        Add job details for a targeted ATS score and
                        role-specific tips.
                      </p>
                    </div>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          business
                        </span>
                        Target Company
                      </span>
                      <input
                        className="w-full h-11 px-4 rounded-xl bg-[#172236]/60 border border-[var(--glass-border)] text-white placeholder-[var(--text-secondary)]/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                        placeholder="e.g. Google, Amazon, Startup Co."
                        type="text"
                        name="company-name"
                        id="company-name"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          badge
                        </span>
                        Target Role
                      </span>
                      <input
                        className="w-full h-11 px-4 rounded-xl bg-[#172236]/60 border border-[var(--glass-border)] text-white placeholder-[var(--text-secondary)]/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                        placeholder="e.g. Frontend Developer, Data Analyst"
                        type="text"
                        name="job-title"
                        id="job-title"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 flex-1">
                      <span className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          description
                        </span>
                        Job Description
                      </span>
                      <textarea
                        className="w-full flex-1 min-h-[120px] p-4 rounded-xl bg-[#172236]/60 border border-[var(--glass-border)] text-white placeholder-[var(--text-secondary)]/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 resize-none"
                        placeholder="Paste the job description here for a more accurate ATS score and keyword match..."
                        name="job-description"
                        id="job-description"
                      />
                    </label>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
