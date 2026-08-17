import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCategories, fetchProperties } from "../api/endpoints.js";
import PropertyCard from "../components/property/PropertyCard.jsx";
import FilterBar from "../components/property/FilterBar.jsx";

const EMPTY_FILTERS = { purchase_type: "", category: "", location: "", price_min: "", price_max: "", price_range: "" };

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    category: searchParams.get("category") || "",
  });
  const [sort, setSort] = useState("-created_at");
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState({ count: 0, results: [], next: null });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {
      purchase_type: filters.purchase_type || undefined,
      category: filters.category || undefined,
      location: filters.location || undefined,
      price_min: filters.price_min || undefined,
      price_max: filters.price_max || undefined,
      ordering: sort,
      page,
    };
    fetchProperties(params)
      .then((data) => {
        setResults((prev) => ({
          count: data.count,
          next: data.next,
          results: page === 1 ? data.results : [...prev.results, ...data.results],
        }));
      })
      .catch(() => setResults({ count: 0, results: [], next: null }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page]);

  const updateFilters = (next) => {
    setPage(1);
    setFilters(next);
  };

  const clearAll = () => {
    setPage(1);
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl">All Properties</h1>
          <p className="text-muted mt-2 text-sm">
            {results.count} {results.count === 1 ? "property" : "properties"} found
          </p>
        </div>
        <select
          className="input-field !w-auto !py-2.5 text-sm"
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value);
          }}
        >
          <option value="-created_at">Sort by: Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-8">
        <FilterBar filters={filters} categories={categories} onChange={updateFilters} onClearAll={clearAll} />
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && page === 1 &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-[340px] bg-charcoal/5" />
          ))}
        {results.results.map((p) => (
          <PropertyCard key={p.id} property={p} showSpecs />
        ))}
      </div>

      {!loading && results.results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted">No properties match those filters.</p>
          <button onClick={clearAll} className="btn-primary mt-6">Clear Filters</button>
        </div>
      )}

      {results.next && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Loading…" : "Load More Properties"}
          </button>
        </div>
      )}
    </div>
  );
}
