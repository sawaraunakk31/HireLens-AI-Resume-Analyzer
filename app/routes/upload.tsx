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

  const handleFileSelect = (f: File | null) => setFile(f);

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
      } catch {
        setErrorMsg(
          `Error: AI returned invalid response. It replied: ${feedbackText.substring(0, 100)}...`,
        );
        return setIsProcessing(false);
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete, redirecting...");
      navigate(`/resume/${uuid}`);
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? `An error occurred: ${error.message}`
          : "An unexpected error occurred",
      );
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form || !file) return;
    const formData = new FormData(form);
    handleAnalyze({
      companyName: formData.get("company-name") as string,
      jobTitle: formData.get("job-title") as string,
      jobDescription: formData.get("job-description") as string,
      file,
    }).catch(console.error);
  };

  return (
    <div className="font-body min-h-screen flex flex-col overflow-x-hidden">
      {/* Subtle grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundSize: "48px 48px",
          backgroundImage:
            "linear-gradient(to right, rgba(77,139,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(77,139,255,0.05) 1px, transparent 1px)",
        }}
      />
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-start py-10 px-4 sm:px-6">
          <div className="w-full max-w-[960px] flex flex-col gap-8">
            {/* ── Title ── */}
            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-widest uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                AI Powered Analysis
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight leading-[1.1]">
                <span className="text-white">Analyze Your </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
                  Resume
                </span>
              </h1>
              <p className="font-body text-white/50 mt-4 text-sm max-w-md mx-auto leading-relaxed">
                Upload for a general AI critique — or add job context for a
                targeted ATS score.
              </p>
            </div>

            {/* ── Error ── */}
            {errorMsg && (
              <div className="bg-red-500/8 border border-red-500/25 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
                <button
                  onClick={() => setErrorMsg("")}
                  className="text-xs text-[var(--text-secondary)] hover:text-white underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* ── Processing ── */}
            {isProcessing ? (
              <div className="flex flex-col items-center gap-6 py-16">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-primary animate-spin"
                    style={{ borderTopColor: "transparent" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      auto_awesome
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-lg animate-pulse">
                    {statusText}
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm mt-1">
                    This may take a moment...
                  </p>
                </div>
              </div>
            ) : (
              /* ── Main form ── */
              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="relative group"
              >
                {/* Decorative border glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-4xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 p-8" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/8 backdrop-blur-xl rounded-4xl overflow-hidden border border-white/12">
                  {/* LEFT — Upload */}
                  <div className="bg-[#0b1221]/95 p-10 flex flex-col gap-8">
                    <div>
                      <h2 className="text-xl font-extrabold text-white font-display tracking-tight mb-2 uppercase text-sm">
                        Upload Resume
                      </h2>
                      <p className="font-body text-white/50 text-xs leading-relaxed font-medium">
                        Start your professional analysis by providing your
                        current resume.
                      </p>
                    </div>

                    <div className="flex-1">
                      <FileUploader
                        file={file}
                        onFileSelect={handleFileSelect}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!file}
                      className="group relative w-full overflow-hidden rounded-2xl py-4 font-extrabold text-sm text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 disabled:bg-white/5 tracking-widest uppercase"
                    >
                      {/* Interactive glow */}
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: !file
                            ? "transparent"
                            : "linear-gradient(135deg, #4d8bff, #3b82f6)",
                        }}
                      />

                      <span className="relative flex items-center justify-center gap-2 tracking-wide text-white/90 group-disabled:text-white/30">
                        <span className="material-symbols-outlined text-lg leading-none">
                          auto_awesome
                        </span>
                        Analyze Document
                      </span>
                    </button>
                  </div>

                  {/* RIGHT — Job Context */}
                  <div className="bg-[#0b1221]/80 p-10 flex flex-col gap-8 border-t lg:border-t-0 lg:border-l border-white/[0.08]">
                    <div>
                      <h2 className="text-sm font-extrabold text-white font-display uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                        Job Context
                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                          Optional
                        </span>
                      </h2>
                      <p className="font-body text-white/50 text-xs leading-relaxed font-medium">
                        Add target details to receive ATS matching and tailored
                        interview tips.
                      </p>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2.5 group/input">
                        <label
                          htmlFor="company-name"
                          className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] ml-1"
                        >
                          Company
                        </label>
                        <input
                          id="company-name"
                          name="company-name"
                          type="text"
                          placeholder="e.g. Google, Apple, Airbnb"
                          className="w-full h-12 px-5 rounded-2xl bg-white/3 border border-white/8 text-white text-sm placeholder-white/20 focus:border-primary/50 focus:bg-white/5 focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                        />
                      </div>

                      <div className="flex flex-col gap-2.5 group/input">
                        <label
                          htmlFor="job-title"
                          className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] ml-1"
                        >
                          Position
                        </label>
                        <input
                          id="job-title"
                          name="job-title"
                          type="text"
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full h-12 px-5 rounded-2xl bg-white/3 border border-white/8 text-white text-sm placeholder-white/20 focus:border-primary/50 focus:bg-white/5 focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                        />
                      </div>

                      <div className="flex flex-col gap-2.5 group/input">
                        <label
                          htmlFor="job-description"
                          className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] ml-1"
                        >
                          Job Description
                        </label>
                        <textarea
                          id="job-description"
                          name="job-description"
                          placeholder="Paste the role requirements here..."
                          className="w-full min-h-[160px] p-5 rounded-2xl bg-white/3 border border-white/8 text-white text-sm placeholder-white/20 focus:border-primary/50 focus:bg-white/5 focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
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
