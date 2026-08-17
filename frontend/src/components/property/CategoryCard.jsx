import { Link } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";

export default function CategoryCard({ category }) {
  return (
    <div className="bg-cream rounded-card p-6">
      <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center mb-4">
        <Building2 size={18} className="text-green" />
      </div>
      <h3 className="font-serif text-lg font-bold text-charcoal mb-2">{category.name}</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{category.description}</p>
      <Link
        to={`/properties?category=${category.slug}`}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest2 text-green hover:gap-2 transition-all"
      >
        Explore <ArrowRight size={14} />
      </Link>
    </div>
  );
}
