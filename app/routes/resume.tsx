import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";
import gsap from "gsap";
import { ArrowLeft, BrainCircuit, Download, ExternalLink } from "lucide-react";

export const meta = () => {
  return [
    { title: "HireLens | Intelligence Report" },
    { name: "description", content: "Detailed overview of your resume" },
  ];
};

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading, auth.isAuthenticated, id, navigate]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) return;
        const data = JSON.parse(resume);
        setResumeData(data);

        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) return;
        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const resumeUrlData = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeUrlData);

        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob) return;
        const imageUrlData = URL.createObjectURL(
          new Blob([imageBlob], { type: "image/png" }),
        );
        setImageUrl(imageUrlData);
        setFeedback(data.feedback);
      } catch (err) {
        console.error("Failed to load resume details", err);
      }
    };
    loadResume();
  }, [id, kv, fs]);

  useEffect(() => {
    if (feedback && dashboardRef.current) {
      gsap.fromTo(
        dashboardRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    }
  }, [feedback]);

  return (
    <main
      className="!pt-0 min-h-screen bg-[var(--bg-primary)] overflow-hidden flex flex-col font-body"
      ref={containerRef}
    >
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-primary/5 to-transparent pointer-events-none z-0"></div>

      <nav className="sticky top-0 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] z-50 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link
            to="/home"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-[var(--glass-border)] transition-colors text-[var(--text-primary)] font-medium shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="font-bold font-display tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 text-lg hidden sm:block">
              HireLens Intelligence
            </span>
          </div>

          <div className="flex gap-2">
            <a
              href={resumeUrl}
              download="resume-optimized.pdf"
              className="px-3 py-2 rounded-lg border border-[var(--glass-border)] text-sm font-medium hover:bg-[var(--glass-surface)] transition-colors flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1 w-full relative z-10 max-w-[1600px] mx-auto">
        {/* Left Side: Resume View */}
        <section className="lg:w-[45%] xl:w-[40%] h-[50vh] lg:h-[calc(100vh-65px)] overflow-hidden flex flex-col relative bg-[var(--bg-secondary)]/30 border-r border-[var(--glass-border)]">
          {/* Header */}
          <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--glass-surface)] backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[var(--text-secondary)]">
                description
              </span>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] truncate max-w-[200px]">
                  {resumeData?.jobTitle || "Resume Document"}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Original Version
                </p>
              </div>
            </div>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[var(--glass-border)] text-[var(--text-secondary)] hover:text-primary transition-colors tooltip group relative"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Open native
                </span>
              </a>
            )}
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-[var(--bg-primary)] p-4 md:p-8 flex items-start justify-center relative">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMEwwIDQwTDQwIDQwTDQwIDBaIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTI4LDEyOCwxMjgsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none z-0"></div>

            {imageUrl ? (
              <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-2xl animate-[fadeIn_0.5s_ease-out_forwards] border border-gray-200 overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Resume Preview"
                  className="w-full h-auto object-contain dark:invert-[.85] dark:hue-rotate-180 dark:contrast-125"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Feedback Dashboard */}
        <section className="lg:w-[55%] xl:w-[60%] h-auto lg:h-[calc(100vh-65px)] overflow-y-auto px-4 sm:px-6 lg:px-10 py-8 scroll-smooth modern-scrollbar">
          <div className="mb-8 animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Analysis Complete
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[var(--text-primary)] mb-2 tracking-tight">
              Intelligence{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Report
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl">
              Here's the detailed breakdown of your resume's performance against
              the{" "}
              <strong className="text-[var(--text-primary)]">
                {resumeData?.companyName || "target company"}
              </strong>{" "}
              job description.
            </p>
          </div>

          {feedback ? (
            <div
              className="flex flex-col gap-6 w-full max-w-4xl"
              ref={dashboardRef}
            >
              <div className="opacity-0">
                <Summary feedback={feedback} />
              </div>
              <div className="opacity-0">
                <ATS
                  score={feedback.ATS.score || 0}
                  suggestions={feedback.ATS.tips || []}
                />
              </div>
              <div className="opacity-0">
                <Details feedback={feedback} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full min-h-[50vh] gap-6 p-8 border border-[var(--glass-border)] rounded-2xl glass-panel">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute inset-2 border-4 border-dashed border-purple-500/40 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
                <BrainCircuit className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold font-display text-[var(--text-primary)] mb-2">
                  Synthesizing intelligence...
                </h3>
                <p className="text-[var(--text-secondary)] max-w-sm">
                  Our neural networks are currently dissecting the resume
                  structure and cross-referencing industry standards.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
