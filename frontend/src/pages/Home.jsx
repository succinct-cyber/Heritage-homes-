import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { fetchFeaturedProperties } from "../api/endpoints.js";
import PropertyCard from "../components/property/PropertyCard.jsx";

const TRUST_ITEMS = [
  { icon: Building2, label: "Modern Architecture" },
  { icon: Leaf, label: "Eco-Friendly Living" },
  { icon: ShieldCheck, label: "Secure Gated Community" },
  { icon: MapPin, label: "Premium Location" },
];

const STATS = [
  { value: "+850", label: "Property Build" },
  { value: "95%", label: "Client Retention" },
  { value: "+150", label: "Expert Agents" },
  { value: "+500", label: "Verified Listings" },
];

const NEEDS = [
  { title: "Family House", desc: "Spacious homes designed for comfort and growing families.", active: true },
  { title: "Office Business", desc: "Workspaces in prime locations to grow your business." },
  { title: "Apartment", desc: "Stylish and convenient urban living for modern city dwellers." },
  { title: "Villa & Condo", desc: "Exclusive luxury living with premium amenities and privacy." },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div
          className="relative h-[500px] sm:h-[600px] lg:h-[819px] bg-cover bg-center flex items-center justify-center text-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop')",
          }}
        >
          <div className="container-page max-w-[896px]">
            <h1 className="text-cream text-5xl sm:text-6xl lg:text-[64px] lg:leading-[70px] font-serif font-bold tracking-[-1.28px]">
              Property
            </h1>
            <p className="text-[#F4F4EE] mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-[29px]">
              Discover premium spaces designed for comfort, security, and elegance in Nigeria's
              most sought-after locations.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 mt-8 border border-cream text-cream rounded text-xs font-bold uppercase tracking-[0.6px] px-8 py-4"
            >
              Find Property <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Trust strip */}
        <div className="container-page">
          <div className="relative -mt-16 bg-green rounded-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] py-8 px-6 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-white">
                <Icon size={22} strokeWidth={1.5} />
                <span className="text-sm leading-6">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-light py-16 sm:py-20">
        <div className="container-page grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <p className="font-sans text-5xl leading-[48px] font-bold text-green-text">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-[1.2px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What You Are Looking For */}
      <section className="section-dark py-16 sm:py-24">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl text-white">What You Are Looking For?</h2>
            <p className="text-muted-dark mt-4 max-w-sm text-sm">
              Browse through our extensive listings to find the perfect home that fits your
              lifestyle.
            </p>
            <Link to="/categories" className="btn-outline-light mt-8 !border-white/70">
              Read More <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {NEEDS.map((n) => (
              <div
                key={n.title}
                className={`rounded-card p-5 ${n.active ? "bg-cream" : "bg-white/95"}`}
              >
                <h3 className="font-serif font-bold text-charcoal">{n.title}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Property */}
      <section className="section-light py-16 sm:py-24">
        <div className="container-page">
          <h2 className="text-3xl sm:text-4xl">Featured Property</h2>
          <p className="text-muted mt-2 text-sm">
            Explore our most viewed and highest-rated listings this week.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-[340px] bg-charcoal/5" />
              ))}
            {!loading &&
              featured.map((p) => <PropertyCard key={p.id} property={p} showSpecs />)}
          </div>

          {!loading && featured.length === 0 && (
            <p className="text-sm text-muted mt-6">
              No featured properties yet — add some in the Django admin.
            </p>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-green">
        <div className="container-page py-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl text-white">Speak With a Consultant</h2>
            <p className="text-green-100/90 mt-2 text-sm max-w-md">
              Join our community of clients and get matched with a Heritage Estates consultant
              today.
            </p>
          </div>
          <Link to="/team" className="btn-outline-light shrink-0">
            Contact Us Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}