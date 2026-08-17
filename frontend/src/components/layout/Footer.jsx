import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { subscribeNewsletter } from "../../api/endpoints.js";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "Rent & Hire", to: "/rent-hire" },
  { label: "Team", to: "/team" },
];

const SUPPORT_LINKS = [
  { label: "Contact Support", to: "/team" },
  { label: "Privacy Policy", to: "#" },
  { label: "Terms of Service", to: "#" },
  { label: "FAQ", to: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await subscribeNewsletter(email);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-charcoal">
      <div className="container-page py-16 sm:py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="font-serif text-[40px] leading-[48px] font-bold text-cream mb-6">Heritage Estates</h3>
          <p className="text-[#B8B8B8] text-base leading-6 max-w-xs">
            Premium Nigerian Real Estate. Discover spaces designed for comfort, security, and
            elegance across the nation's most sought-after locations.
          </p>
          <div className="flex items-center gap-4 mt-6 text-[#B8B8B8]">
            <Facebook size={18} className="hover:text-white cursor-pointer" />
            <Twitter size={18} className="hover:text-white cursor-pointer" />
            <Instagram size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Quick Links + Support */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[1.2px] text-green-light mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-base leading-6 text-[#B8B8B8] underline hover:text-green-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[1.2px] text-green-light mb-4">Support</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-base leading-6 text-[#B8B8B8] underline hover:text-green-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[1.2px] text-green-light mb-4">Newsletter</h4>
          <p className="text-base leading-6 text-[#B8B8B8] mb-4">
            Subscribe for exclusive market insights and premier property listings.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="flex-1 rounded-md bg-white/5 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-[#B8B8B8] focus:outline-none focus:border-green"
            />
            <button
              type="submit"
              className="bg-green text-white rounded text-xs font-bold uppercase tracking-[1.2px] px-4 py-2.5"
            >
              {status === "loading" ? "…" : "Join"}
            </button>
          </form>
          {status === "done" && (
            <p className="text-xs text-green-light mt-2">Subscribed — welcome aboard.</p>
          )}
          {status === "error" && (
            <p className="text-xs text-red-300 mt-2">Something went wrong. Try again.</p>
          )}
        </div>
      </div>

      <div className="border-t border-[#E5E2E1]/20">
        <div className="container-page py-6 text-sm leading-5 text-[#B8B8B8]">
          © {new Date().getFullYear()} Heritage Estates. All rights reserved. Premium Nigerian Real Estate.
        </div>
      </div>
    </footer>
  );
}