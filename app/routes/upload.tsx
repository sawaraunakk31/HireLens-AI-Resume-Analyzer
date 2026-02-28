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

      // Clean up markdown code blocks if the AI included them
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
      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 z-0 opacity-10 dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, #4d8bff 1px, transparent 1px), linear-gradient(to bottom, #4d8bff 1px, transparent 1px)",
        }}
      ></div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-full grow">
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 flex justify-center py-8 lg:py-12 px-4 sm:px-6">
          <div className="flex flex-col max-w-[800px] w-full gap-8">
            {/* Page Title Section */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                AI Powered Analysis
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
                Analyze New{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  Candidate
                </span>
              </h1>
              <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
                Upload a resume and let our AI engine extract insights, skills,
                and compatibility scores in seconds.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center mt-4 mb-4">
                <p className="text-red-500 dark:text-red-400 font-medium">
                  {errorMsg}
                </p>
                <button
                  onClick={() => setErrorMsg("")}
                  className="mt-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {isProcessing ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-6">
                <h2 className="text-2xl text-[var(--text-primary)] font-semibold animate-pulse">
                  {statusText}
                </h2>
                <div className="relative aspect-[4/3] w-full max-w-md rounded-3xl overflow-hidden glass-panel-heavy p-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 opacity-50 z-0"></div>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite] z-20"></div>
                  <img
                    src="/images/resume-scan.gif"
                    alt="Scanning"
                    className="w-full h-full object-cover mix-blend-luminosity dark:mix-blend-screen opacity-80 z-10"
                  />
                </div>
              </div>
            ) : (
              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="glass-panel-heavy rounded-2xl p-6 md:p-8 space-y-8 relative overflow-hidden text-left"
              >
                {/* Decorative glow behind card */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 relative z-10 w-full">
                  <label className="flex flex-col gap-2 group">
                    <span className="text-[var(--text-secondary)] text-sm font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        business
                      </span>
                      Target Company
                    </span>
                    <input
                      className="w-full rounded-xl bg-[#172236]/50 dark:bg-[var(--form-bg)]/50 border border-[var(--glass-border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[var(--form-bg)] transition-all duration-300 h-14 px-4 shadow-inner"
                      placeholder="e.g. CyberDyne Systems"
                      type="text"
                      name="company-name"
                      id="company-name"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 group">
                    <span className="text-[var(--text-secondary)] text-sm font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        badge
                      </span>
                      Target Role
                    </span>
                    <input
                      className="w-full rounded-xl bg-[#172236]/50 dark:bg-[var(--form-bg)]/50 border border-[var(--glass-border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[var(--form-bg)] transition-all duration-300 h-14 px-4 shadow-inner"
                      placeholder="e.g. Senior Neural Engineer"
                      type="text"
                      name="job-title"
                      id="job-title"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-2 group">
                    <span className="text-[var(--text-secondary)] text-sm font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        description
                      </span>
                      Job Description
                    </span>
                    <div className="relative">
                      <textarea
                        className="w-full rounded-xl bg-[#172236]/50 dark:bg-[var(--form-bg)]/50 border border-[var(--glass-border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[var(--form-bg)] transition-all duration-300 min-h-[140px] p-4 resize-y shadow-inner"
                        placeholder="Paste the full job description here to improve analysis accuracy..."
                        name="job-description"
                        id="job-description"
                        required
                      ></textarea>
                    </div>
                  </label>
                </div>

                {/* Separator */}
                <div className="relative h-px w-full bg-[var(--glass-border)] my-8">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 px-4 py-1 bg-[var(--glass-surface)] backdrop-blur-md border border-[var(--glass-border)] text-[var(--text-secondary)] text-xs font-bold tracking-widest rounded-full shadow-sm">
                    AND
                  </div>
                </div>

                {/* Upload Zone */}
                <FileUploader file={file} onFileSelect={handleFileSelect} />

                {/* Action Button */}
                <div className="flex justify-end pt-2 z-10 w-full relative">
                  <button
                    type="submit"
                    disabled={!file}
                    className="relative overflow-hidden group w-full md:w-auto bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(77,139,255,0.4)] hover:shadow-[0_0_30px_rgba(77,139,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                    <span>Analyze Resume</span>
                  </button>
                </div>
              </form>
            )}

            {/* Footer Links */}
            <div className="flex justify-center gap-6 text-[var(--text-secondary)] text-sm mb-12">
              <span className="hover:text-primary transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)] my-auto"></span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Help Center
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
