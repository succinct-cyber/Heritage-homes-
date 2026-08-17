import { ExternalLink, MapPin } from "lucide-react";

/**
 * A self-contained, styled map preview that links out to Google Maps.
 * Deliberately doesn't depend on the Google Maps JS SDK (API key + billing)
 * or a tile-server API key — just a real, working link to the actual address.
 * Swap in an embedded <iframe>/JS map later without touching the call site.
 */
export default function LocationMapPreview({ address, latitude, longitude }) {
  const query = latitude && longitude ? `${latitude},${longitude}` : address;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[16/9] rounded-card overflow-hidden border border-charcoal/10"
    >
      {/* Decorative abstract map background — pure CSS/SVG, no external tile dependency */}
      <svg
        viewBox="0 0 800 450"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="800" height="450" fill="#EEF2EC" />
        <g stroke="#C9D4C6" strokeWidth="2">
          <line x1="0" y1="90" x2="800" y2="70" />
          <line x1="0" y1="200" x2="800" y2="230" />
          <line x1="0" y1="340" x2="800" y2="310" />
          <line x1="120" y1="0" x2="90" y2="450" />
          <line x1="320" y1="0" x2="360" y2="450" />
          <line x1="560" y1="0" x2="520" y2="450" />
          <line x1="700" y1="0" x2="740" y2="450" />
        </g>
        <path d="M0,260 Q250,180 420,260 T800,240 V450 H0 Z" fill="#DCE6DC" opacity="0.6" />
        {[...Array(14)].map((_, i) => (
          <rect
            key={i}
            x={40 + (i % 7) * 108}
            y={30 + Math.floor(i / 7) * 190}
            width={60 + (i % 3) * 10}
            height={40 + (i % 4) * 8}
            fill="#E3E9DF"
            stroke="#CBD6C8"
            strokeWidth="1.5"
            rx="3"
          />
        ))}
      </svg>

      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors" />

      {/* Pin marker */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green text-white shadow-lg">
          <MapPin size={20} className="fill-white" />
        </span>
        <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-charcoal shadow flex items-center gap-1.5">
          View on Google Maps <ExternalLink size={12} />
        </span>
      </div>

      {/* Address plate, bottom-left, matching the Figma treatment */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white rounded-lg px-4 py-3 shadow-md max-w-xs">
        <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Heritage Estates</p>
        <p className="text-xs text-muted mt-0.5 truncate">{address}</p>
      </div>
    </a>
  );
}
