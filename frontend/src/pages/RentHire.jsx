import { useEffect, useState } from "react";
import { fetchProperties } from "../api/endpoints.js";
import PropertyCard from "../components/property/PropertyCard.jsx";

export default function RentHire() {
  const [mode, setMode] = useState("rent"); // rent | lease
  const [location, setLocation] = useState("");
  const [results, setResults] = useState({ count: 0, results: [], next: null });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProperties({ purchase_type: mode, location: location || undefined, page })
      .then((data) =>
        setResults((prev) => ({
          count: data.count,
          next: data.next,
          results: page === 1 ? data.results : [...prev.results, ...data.results],
        }))
      )
      .catch(() => setResults({ count: 0, results: [], next: null }))
      .finally(() => setLoading(false));
  }, [mode, location, page]);

  return (
    <div>
      <section
        className="relative py-24 sm:py-32 bg-cover bg-center text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,15,10,0.45), rgba(10,15,10,0.65)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="container-page">
          <h1 className="text-white text-4xl sm:text-5xl">Curated Spaces for Rent & Hire</h1>
          <p className="text-white/85 mt-4 max-w-xl mx-auto text-sm">
            Discover premium residential apartments for rent and exclusive commercial venues
            tailored for your next grand event or executive workspace.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 bg-white/10 rounded-full px-2 py-1">
            <button
              onClick={() => { setMode("rent"); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest2 transition-colors ${
                mode === "rent" ? "bg-white text-charcoal" : "text-white"
              }`}
            >
              Rentals
            </button>
            <button
              onClick={() => { setMode("lease"); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest2 transition-colors ${
                mode === "lease" ? "bg-white text-charcoal" : "text-white"
              }`}
            >
              Lease / Hire
            </button>
          </div>

          <div className="mt-8 bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto text-left">
            <input
              placeholder="Location — e.g. Ikoyi, Victoria Island"
              className="input-field flex-1"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
            />
            <button className="btn-primary shrink-0" onClick={() => setPage(1)}>Search Listings</button>
          </div>
        </div>
      </section>

      <section className="section-light py-16">
        <div className="container-page">
          <h2 className="text-3xl sm:text-4xl">Available Properties</h2>
          <p className="text-muted mt-2 text-sm">Explore our premium selection for rent and hire.</p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && page === 1 &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-[340px] bg-charcoal/5" />
              ))}
            {results.results.map((p) => (
              <PropertyCard key={p.id} property={p} showSpecs />
            ))}
          </div>

          {!loading && results.results.length === 0 && (
            <p className="text-center text-muted py-16">No listings match that search yet.</p>
          )}

          {results.next && (
            <div className="flex justify-center mt-10">
              <button onClick={() => setPage((p) => p + 1)} disabled={loading} className="btn-primary">
                {loading ? "Loading…" : "Load More Listings"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
