import { X } from "lucide-react";

const PURCHASE_TYPES = [
  { value: "", label: "Purchase Type" },
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "lease", label: "Lease / Hire" },
];

const PRICE_RANGES = [
  { value: "", label: "Price Range" },
  { value: "0-50000000", label: "Under ₦50M" },
  { value: "50000000-200000000", label: "₦50M – ₦200M" },
  { value: "200000000-500000000", label: "₦200M – ₦500M" },
  { value: "500000000-", label: "₦500M+" },
];

export default function FilterBar({ filters, categories, onChange, onClearAll }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const handlePriceRange = (e) => {
    const [min, max] = e.target.value.split("-");
    onChange({ ...filters, price_min: min || "", price_max: max || "", price_range: e.target.value });
  };

  const activeChips = [];
  if (filters.purchase_type) {
    activeChips.push({
      key: "purchase_type",
      label: PURCHASE_TYPES.find((p) => p.value === filters.purchase_type)?.label,
    });
  }
  if (filters.category) {
    activeChips.push({
      key: "category",
      label: categories.find((c) => c.slug === filters.category)?.name || filters.category,
    });
  }
  if (filters.location) {
    activeChips.push({ key: "location", label: filters.location });
  }
  if (filters.price_range) {
    activeChips.push({
      key: "price_range",
      label: PRICE_RANGES.find((p) => p.value === filters.price_range)?.label,
      clears: ["price_range", "price_min", "price_max"],
    });
  }

  const removeChip = (chip) => {
    const next = { ...filters };
    (chip.clears || [chip.key]).forEach((k) => (next[k] = ""));
    onChange(next);
  };

  return (
    <div>
      <div className="bg-white border border-charcoal/10 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <select
          className="input-field !py-2.5 text-sm"
          value={filters.purchase_type}
          onChange={handle("purchase_type")}
        >
          {PURCHASE_TYPES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          className="input-field !py-2.5 text-sm"
          value={filters.category}
          onChange={handle("category")}
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          className="input-field !py-2.5 text-sm"
          value={filters.price_range || ""}
          onChange={handlePriceRange}
        >
          {PRICE_RANGES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Location"
          className="input-field !py-2.5 text-sm"
          value={filters.location}
          onChange={handle("location")}
        />
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => removeChip(chip)}
              className="badge-chip !normal-case gap-1.5"
            >
              {chip.label} <X size={12} />
            </button>
          ))}
          <button
            onClick={onClearAll}
            className="text-xs text-muted underline underline-offset-2 hover:text-charcoal"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
