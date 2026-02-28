import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { TrendingUp, UploadCloud, FileText } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireLens - Dashboard" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState<boolean>(true);

  const containerRef = useRef<HTMLElement>(null);
  const resumesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/home");
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const resumesData = (await kv.list("resume:*", true)) as KVItem[];
        const parsedResumes = resumesData?.map(
          (resume) => JSON.parse(resume.value) as Resume,
        );
        // Sort by most recent first if possible (assuming id might be sequential or timestamp)
        setResumes(parsedResumes?.reverse() || []);
      } catch (err) {
        console.error("Failed to load resumes", err);
      } finally {
        setLoadingResumes(false);
      }
    };
    if (auth.isAuthenticated) loadResumes();
  }, [auth.isAuthenticated, kv]);

  useEffect(() => {
    if (!loadingResumes && resumes.length > 0 && resumesRef.current) {
      gsap.fromTo(
        resumesRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
        },
      );
    }
  }, [loadingResumes, resumes]);

  // Calculations for Stats
  const totalAnalyzed = resumes.length;
  const avgAtsScore =
    totalAnalyzed > 0
      ? Math.round(
          resumes.reduce(
            (acc, curr) => acc + (curr.feedback?.overallScore || 0),
            0,
          ) / totalAnalyzed,
        )
      : 0;

  // Extract most common job title (simplified)
  const jobTitles = resumes.map((r) => r.jobTitle).filter(Boolean);
  const topRole = jobTitles.length > 0 ? jobTitles[0] : "None Yet";

  return (
    <main
      className="flex flex-col min-h-screen font-body w-full relative z-0"
      ref={containerRef}
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-[radial-gradient(circle_at_center,rgba(77,139,255,0.15)_0%,transparent_70%)] -z-10 pointer-events-none"></div>

      <Navbar />

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 relative">
        {/* Greeting Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-[fadeIn_0.5s_ease-out_forwards]">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                User
              </span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Your resume optimization insights are ready.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-[fadeIn_0.7s_ease-out_forwards]">
          {/* Stat Card 1 */}
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium mb-1">
              Total Analyzed
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {loadingResumes ? "-" : totalAnalyzed}
              </span>
              {!loadingResumes && totalAnalyzed > 0 && (
                <span className="text-emerald-500 text-sm font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Active
                </span>
              )}
            </div>
            <div className="w-full bg-[var(--text-primary)]/10 h-1 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full shadow-[0_0_10px_rgba(77,139,255,0.5)]"
                style={{ width: totalAnalyzed > 0 ? "75%" : "0%" }}
              ></div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px] text-emerald-500">
                check_circle
              </span>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium mb-1">
              Avg ATS Score
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {loadingResumes ? "-" : avgAtsScore}
                <span className="text-lg text-[var(--text-secondary)] font-normal">
                  /100
                </span>
              </span>
            </div>
            <div className="w-full bg-[var(--text-primary)]/10 h-1 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                style={{ width: `${avgAtsScore}%` }}
              ></div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px] text-amber-500">
                work
              </span>
            </div>
            <h3 className="text-[var(--text-secondary)] font-medium mb-1">
              Top Matched Role
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold truncate">
                {loadingResumes ? "..." : totalAnalyzed > 0 ? topRole : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
              <span className="text-amber-500 text-sm font-medium">
                Target Path
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          Recent Analyses
          <span className="text-xs font-normal text-[var(--text-secondary)] border border-[var(--glass-border)] rounded-full px-2 py-0.5">
            All time
          </span>
        </h2>

        {loadingResumes ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[var(--text-secondary)]">
              Syncing data cubes...
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24"
            ref={resumesRef}
          >
            {/* Render actual resumes */}
            {resumes.map((resume: Resume) => (
              <div key={resume.id} className="opacity-0">
                <ResumeCard resume={resume} />
              </div>
            ))}

            {/* Upload New Card (Always show to allow uploading more) */}
            <Link
              to="/upload"
              className="glass-panel border-dashed border-2 hover:border-primary/50 border-[var(--glass-border)] rounded-xl p-6 transition-all duration-300 hover:bg-[var(--glass-surface)] cursor-pointer flex flex-col items-center justify-center h-full min-h-[280px] group opacity-0"
              style={{ opacity: 1 }} // Ensure it shows if no animations trigger
            >
              <div className="size-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <UploadCloud className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-primary transition-colors" />
              </div>
              <h4 className="font-bold text-lg mb-2">Upload New Resume</h4>
              <p className="text-[var(--text-secondary)] text-sm text-center max-w-[200px]">
                Drag and drop your PDF or DOCX file here to start analyzing
              </p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
