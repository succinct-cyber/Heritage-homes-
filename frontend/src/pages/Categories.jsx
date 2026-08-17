import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchCategories } from "../api/endpoints.js";
import CategoryCard from "../components/property/CategoryCard.jsx";

const PLACEHOLDER = (seed) =>
  `https://images.unsplash.com/photo-${seed}?q=80&w=1200&auto=format&fit=crop`;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = categories.filter((c) => !c.is_specific_need);
  const specific = categories.filter((c) => c.is_specific_need);
  const [main, ...rest] = featured;

  return (
    <div>
      <section className="section-light py-16 sm:py-20 text-center">
        <div className="container-page">
          <h1 className="text-4xl sm:text-5xl">Find Your Perfect Fit</h1>
          <p className="text-muted mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Explore our curated selection of premium properties, tailored to meet your unique
            lifestyle and investment goals across Nigeria's most sought-after locations.
          </p>
        </div>
      </section>

      {/* Main featured category grid */}
      {!loading && main && (
        <section className="section-light pb-16">
          <div className="container-page grid lg:grid-cols-3 gap-4">
            <Link
              to={`/properties?category=${main.slug}`}
              className="lg:col-span-2 relative rounded-card overflow-hidden group min-h-[320px] block"
            >
              <img
                src={main.hero_image || PLACEHOLDER("1613977257363-707ba9348227")}
                alt={main.name}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {main.badge_label && (
                <span className="absolute top-5 left-5 badge-green">{main.badge_label}</span>
              )}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <h3 className="text-white font-serif text-2xl font-bold">{main.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{main.description}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-charcoal shrink-0">
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <div className="flex flex-col gap-4">
              {rest.slice(0, 2).map((c) => (
                <Link
                  key={c.id}
                  to={`/properties?category=${c.slug}`}
                  className="relative rounded-card overflow-hidden group flex-1 min-h-[150px] block"
                >
                  <img
                    src={c.hero_image || PLACEHOLDER("1600585154340-be6161a56a0c")}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <h3 className="text-white font-serif text-lg font-bold">{c.name}</h3>
                      <p className="text-white/80 text-xs mt-1">{c.description}</p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-charcoal shrink-0">
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specific Needs */}
      <section className="section-dark py-16 sm:py-24">
        <div className="container-page">
          <h2 className="text-3xl sm:text-4xl text-white">Specific Needs</h2>
          <p className="text-muted-dark mt-3 max-w-xl text-sm">
            Narrow down your search with our specialized property categories designed for
            distinct lifestyles and professional requirements.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {specific.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
