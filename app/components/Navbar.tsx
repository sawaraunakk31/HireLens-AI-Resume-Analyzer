import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="flex items-center hover:scale-105 transition-transform"
      >
        <img
          src="/HireLens_Logo.png"
          alt="HireLens Logo"
          className="h-8 md:h-10 w-auto object-contain dark:contrast-125 dark:drop-shadow-[0_0_8px_rgba(77,139,255,0.5)]"
        />
      </Link>
      <div className="flex items-center gap-4">
        <Link
          to="/upload"
          className="primary-button w-fit hover:scale-105 transition-transform"
        >
          Upload
        </Link>
        {auth.isAuthenticated ? (
          <button
            onClick={() => {
              auth.signOut();
              navigate("/");
            }}
            className="px-4 py-2 rounded-lg border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white hover:bg-red-500 text-sm font-semibold transition-all"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 rounded-lg border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-semibold transition-all hover:bg-[var(--glass-surface)]"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
