import { Link } from "react-router-dom";
import { ArrowRight, Bath, BedDouble, MapPin, Ruler, Star } from "lucide-react";
import { formatNaira, purchaseTypeBadge } from "../../utils/format.js";

const PLACEHOLDER = "https://placehold.co/640x480/1a1a1a/f9faf4?text=Heritage+Estates";

export default function PropertyCard({ property, showSpecs = false, dark = false }) {
  const {
    slug, title, location, primary_image, purchase_type,
    is_top_choice, price, rent_period_display, bedrooms, bathrooms, size_sqm,
  } = property;

  return (
    <Link
      to={`/properties/${slug}`}
      className={`card group block ${dark ? "border-white/10 bg-white/[0.03]" : ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primary_image || PLACEHOLDER}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge-dark">{purchaseTypeBadge(purchase_type)}</span>
          {is_top_choice && (
            <span className="badge-green">
              <Star size={11} className="fill-white" /> Top Choice
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className={`font-serif text-lg font-bold ${dark ? "text-white" : "text-charcoal"}`}>
          {title}
        </h3>
        <p className={`mt-1 flex items-center gap-1 text-sm ${dark ? "text-muted-dark" : "text-muted"}`}>
          <MapPin size={13} /> {location}
        </p>

        {showSpecs && (bedrooms || bathrooms || size_sqm) && (
          <div className={`mt-3 flex items-center gap-4 text-xs ${dark ? "text-muted-dark" : "text-muted"}`}>
            {bedrooms ? (
              <span className="flex items-center gap-1"><BedDouble size={14} /> {bedrooms}</span>
            ) : null}
            {bathrooms ? (
              <span className="flex items-center gap-1"><Bath size={14} /> {bathrooms}</span>
            ) : null}
            {size_sqm ? (
              <span className="flex items-center gap-1"><Ruler size={14} /> {size_sqm} sqm</span>
            ) : null}
          </div>
        )}

        <div className={`mt-4 pt-4 border-t flex items-center justify-between ${dark ? "border-white/10" : "border-charcoal/10"}`}>
          <p className={`font-bold ${dark ? "text-white" : "text-charcoal"}`}>
            {formatNaira(price)}
            {rent_period_display && (
              <span className={`ml-1 text-xs font-normal ${dark ? "text-muted-dark" : "text-muted"}`}>
                {rent_period_display}
              </span>
            )}
          </p>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              dark
                ? "border-white/30 text-white group-hover:bg-white group-hover:text-charcoal"
                : "border-charcoal/20 text-charcoal group-hover:bg-charcoal group-hover:text-white"
            }`}
          >
            <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
