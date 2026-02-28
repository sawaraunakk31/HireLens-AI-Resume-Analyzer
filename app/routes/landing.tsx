import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import gsap from "gsap";
import { usePuterStore } from "~/lib/puter";

export function meta() {
  return [
    { title: "HireLens - AI Resume Analyzer" },
    { name: "description", content: "Extraordinary AI Resume feedback" },
  ];
}

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { auth } = usePuterStore();
  const isLoggedIn = auth.isAuthenticated;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline
      const tl = gsap.timeline();

      // Initial state
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        y: 40,
        opacity: 0,
      });
      gsap.set(visualRef.current, {
        y: 60,
        opacity: 0,
      });

      // Animations
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
      })
        .to(
          subtitleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.7",
        )
        .to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.5)",
          },
          "-=0.5",
        )
        .to(
          visualRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=0.8",
        );

      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5,
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="font-body min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-white"
      ref={containerRef}
    >
      {/* Background Grid Effect */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-20 opacity-5"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, #4d8bff 1px, transparent 1px), linear-gradient(to bottom, #4d8bff 1px, transparent 1px)",
          maskImage:
            "linear-gradient(to bottom, transparent, 10%, white, 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, 5%, white, 95%, transparent)",
        }}
      ></div>

      {/* Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Floating Navbar */}
        <div className="fixed top-6 left-0 right-0 z-50 px-4">
          <header className="max-w-5xl mx-auto rounded-full border border-white/10 bg-[#0b1221]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="px-6 py-3 flex items-center justify-between">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/HireLens_Logo.png"
                  alt="HireLens Logo"
                  className="h-7 w-auto object-contain dark:contrast-125 drop-shadow-[0_0_8px_rgba(77,139,255,0.3)]"
                />
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-10">
                <a
                  href="#features"
                  className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors font-display"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors font-display"
                >
                  Process
                </a>
                <Link
                  className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors font-display"
                  to="/upload"
                >
                  Analyze
                </Link>
              </nav>

              {/* Auth Cluster */}
              <div className="flex items-center gap-4">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/home"
                      className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 hover:text-white transition-colors px-3 cursor-pointer"
                    >
                      Home
                    </Link>
                    <button
                      onClick={() => {
                        auth.signOut();
                        navigate("/");
                      }}
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-500 text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-full transition-all"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      className="text-white/40 hover:text-white text-[10px] font-extrabold uppercase tracking-widest transition-colors hidden sm:block"
                      to="/auth"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/auth?next=/upload"
                      className="bg-primary hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.15em] py-2.5 px-6 rounded-full transition-all shadow-lg shadow-primary/20"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>
        </div>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Hero Content */}
                <div className="flex flex-col gap-6 text-center lg:text-left">
                  <div className="inline-flex items-center self-center lg:self-start gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined text-sm">
                      auto_awesome
                    </span>
                    AI-Powered Resume Analysis
                  </div>

                  <h1
                    ref={titleRef}
                    className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-white"
                  >
                    Analyze. Optimize.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(77,139,255,0.3)]">
                      Get Hired.
                    </span>
                  </h1>

                  <p
                    ref={subtitleRef}
                    className="font-body text-lg sm:text-xl text-white/50 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
                  >
                    Unlock your career potential with our futuristic AI resume
                    analyzer. Get instant feedback, beat the ATS bots, and land
                    interviews 3x faster.
                  </p>

                  <div
                    ref={ctaRef}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4"
                  >
                    <Link
                      to="/auth?next=/upload"
                      className="group relative flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white text-base font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(77,139,255,0.4)] hover:shadow-[0_0_30px_rgba(77,139,255,0.6)] overflow-hidden"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                      <span className="material-symbols-outlined">
                        analytics
                      </span>
                      <span>Analyze My Resume</span>
                    </Link>
                    <Link
                      to="/auth?next=/home"
                      className="flex items-center justify-center gap-2 bg-[var(--glass-surface)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] text-[var(--text-primary)] text-base font-medium py-3.5 px-8 rounded-xl backdrop-blur-md transition-all"
                    >
                      <span className="material-symbols-outlined">
                        space_dashboard
                      </span>
                      <span>Dashboard</span>
                    </Link>
                  </div>
                </div>

                {/* Hero Visual */}
                <div
                  ref={visualRef}
                  className="relative lg:h-[600px] flex items-center justify-center perspective-[1000px] z-20"
                >
                  {/* Floating Glass Card */}
                  <div
                    className="relative w-full max-w-md aspect-[3/4] rounded-2xl p-6 glass-panel-heavy shadow-2xl overflow-hidden flex flex-col gap-4 transform-gpu transition-transform duration-700 ease-out hover:rotate-y-0 hover:rotate-x-0"
                    style={{ transform: "rotateY(-12deg) rotateX(6deg)" }}
                  >
                    {/* Mock UI Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        JD
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-[var(--text-primary)]/20 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-[var(--text-primary)]/10 rounded"></div>
                      </div>
                      <div className="ml-auto px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/30">
                        98 Score
                      </div>
                    </div>

                    {/* Mock Resume Lines */}
                    <div className="space-y-3 opacity-60">
                      <div className="h-2 w-full bg-[var(--text-primary)]/10 rounded"></div>
                      <div className="h-2 w-5/6 bg-[var(--text-primary)]/10 rounded"></div>
                      <div className="h-2 w-4/6 bg-[var(--text-primary)]/10 rounded"></div>
                    </div>

                    <hr className="border-[var(--glass-border)] my-2" />

                    {/* Analysis Result */}
                    <div className="bg-black/20 dark:bg-black/40 rounded-lg p-4 border border-primary/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary">
                          check_circle
                        </span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          Strong Impact Verbs
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Your usage of action verbs has improved by 45%.
                        Recruiters love this structure.
                      </p>
                    </div>

                    <div className="bg-black/20 dark:bg-black/40 rounded-lg p-4 border border-yellow-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-yellow-500">
                          warning
                        </span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          Missing Keywords
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Add "Project Management" and "Agile" to match the job
                        description better.
                      </p>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -right-4 top-1/2 bg-[var(--card-bg)] border border-[var(--glass-border)] p-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce z-30">
                      <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                        <span className="material-symbols-outlined text-xl">
                          trending_up
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          Interview Chances
                        </div>
                        <div className="text-sm font-bold tracking-wide">
                          +85% Boost
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background Glow behind card */}
                  <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
                  Why Choose HireLens?
                </h2>
                <p className="font-body text-white/50 text-lg leading-relaxed">
                  Leverage the power of futuristic AI to craft a resume that
                  stands out in the digital pile.
                </p>
              </div>

              <div
                ref={featuresRef}
                className="grid md:grid-cols-3 gap-6 lg:gap-8"
              >
                {/* Feature 1 */}
                <div className="glass-panel-heavy p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl">
                      psychology
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 font-display tracking-tight text-white">
                    Deep AI Analysis
                  </h3>
                  <p className="font-body text-white/50 leading-relaxed text-sm">
                    Our neural networks dissect your resume structure and
                    content, offering deep-dive suggestions that go beyond
                    simple grammar checks.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="glass-panel-heavy p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl">
                      fact_check
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 font-display tracking-tight text-white">
                    ATS Optimization
                  </h3>
                  <p className="font-body text-white/50 leading-relaxed text-sm">
                    Ensure your resume passes Applicant Tracking Systems. We
                    simulate top ATS algorithms to guarantee your application
                    gets seen by humans.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="glass-panel-heavy p-8 rounded-2xl hover:border-pink-500/50 transition-all duration-300 group hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl">
                      insights
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 font-display tracking-tight text-white">
                    Career Insights
                  </h3>
                  <p className="font-body text-white/50 leading-relaxed text-sm">
                    Get data-driven insights tailored to your industry. Compare
                    your skills against market demands and bridge the gap to
                    your dream job.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="how-it-works" className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 pointer-events-none"></div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="glass-panel-heavy rounded-3xl p-10 md:p-16 text-center shadow-[0_0_50px_rgba(77,139,255,0.15)] glow-border-hover">
                <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white leading-tight">
                  Ready to land your dream job?
                </h2>
                <p className="font-body text-white/50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of job seekers who have optimized their resumes
                  with HireLens and secured interviews at top tech companies.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/auth?next=/upload"
                    className="bg-primary hover:bg-blue-600 text-white text-base font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 transform hover:scale-105"
                  >
                    Start Scanning Free
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Redesigned Minimal Footer */}
        <footer className="border-t border-white/5 bg-[#0b1221] py-8 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src="/HireLens_Logo.png"
                  alt="Logo"
                  className="h-6 w-auto contrast-125"
                />
              </Link>
              <div className="hidden sm:block h-3 w-px bg-white/10" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                © 2026 · HireLens · Future Focused
              </p>
            </div>

            <nav className="flex items-center gap-8">
              <a
                href="#features"
                className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-primary transition-colors"
              >
                How it Works
              </a>
              <Link
                to="/upload"
                className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-primary transition-colors"
              >
                Analyze
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
