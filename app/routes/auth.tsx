import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { Sparkles } from "lucide-react";

export const meta = () => {
  return [
    { title: "HireLens - Authentication" },
    { name: "description", content: "Log in to your account" },
  ];
};

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1] || "/home";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] -z-20"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl floating-orb -z-10" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-3xl floating-orb -z-10"
        style={{ animationDelay: "1s" }}
      />

      <div className="p-[1px] rounded-[2rem] bg-gradient-to-b from-[var(--glass-border)] to-transparent relative z-10 w-full max-w-md mx-4 shadow-2xl">
        <section className="flex flex-col gap-10 bg-[var(--glass-bg)] backdrop-blur-2xl rounded-[2rem] p-10 text-center border border-[var(--glass-border)]">
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 mb-2">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold !tracking-normal">
              Welcome Back
            </h1>
            <h2 className="text-lg text-[var(--text-secondary)]">
              Log in to unlock your career potential
            </h2>
          </div>
          <div>
            {isLoading ? (
              <button className="w-full py-4 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg animate-pulse">
                <p>Authenticating...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="w-full py-4 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg"
                    onClick={auth.signOut}
                  >
                    <p>Sign Out</p>
                  </button>
                ) : (
                  <button
                    className="relative w-full py-4 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg overflow-hidden group hover:scale-[1.02] transition-transform shadow-lg shadow-blue-500/10"
                    onClick={auth.signIn}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <p className="relative z-10">Sign In with Puter</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
