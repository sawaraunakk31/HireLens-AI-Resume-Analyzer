import { Link } from "react-router";

const Navbar = () => {
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
      </div>
    </nav>
  );
};

export default Navbar;
