import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Search, User, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "Rent & Hire", to: "/rent-hire" },
  { label: "Categories", to: "/categories" },
  { label: "Team", to: "/team" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-xs font-bold tracking-[1.2px] transition-colors ${
      isActive ? "text-green-text border-b-2 border-green-text pb-[6px] opacity-80" : "text-nav-link hover:text-green-text"
    }`;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setOpen(false);
    navigate("/");
  };

  const displayName = user?.first_name || user?.email?.split("@")[0] || "Account";

  return (
    <header className="sticky top-0 z-40 bg-cream border-b border-nav-border">
      <div className="container-page flex items-center justify-between h-[81px]">
        <Link to="/" className="font-serif text-2xl font-bold text-green-text shrink-0">
          Heritage Estates
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button aria-label="Search" className="text-nav-link hover:text-green-text">
            <Search size={18} />
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md border border-charcoal/20 px-4 py-2.5 text-sm hover:border-charcoal"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green text-white text-[11px] font-semibold uppercase">
                  {displayName.charAt(0)}
                </span>
                {displayName}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-charcoal/10 bg-white shadow-lg py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-cream"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="bg-green text-white rounded text-xs font-bold uppercase tracking-[1.2px] px-6 py-3"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-green-text"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-nav-border bg-cream">
          <nav className="container-page flex flex-col py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-base border-b border-charcoal/5 ${isActive ? "text-green-text font-semibold" : "text-nav-link"}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 py-3 text-sm text-charcoal">
                  <User size={16} /> {displayName}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-outline w-full mt-2 justify-center"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/sign-in"
                onClick={() => setOpen(false)}
                className="bg-green text-white rounded text-xs font-bold uppercase tracking-[1.2px] px-6 py-3 w-full mt-4 text-center"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}