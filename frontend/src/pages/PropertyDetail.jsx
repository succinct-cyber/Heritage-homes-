import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bath, BedDouble, Calendar, Check, MapPin, Ruler, Tag, Building2 } from "lucide-react";
import { fetchPropertyBySlug, fetchSimilarProperties, submitInquiry } from "../api/endpoints.js";
import { formatNaira, purchaseTypeBadge } from "../utils/format.js";
import PropertyCard from "../components/property/PropertyCard.jsx";
import LocationMapPreview from "../components/property/LocationMapPreview.jsx";

const PLACEHOLDER = "https://placehold.co/1200x800/1a1a1a/f9faf4?text=Heritage+Estates";

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setLoading(true);
    fetchPropertyBySlug(slug)
      .then((data) => {
        setProperty(data);
        setForm((f) => ({ ...f, message: `I am interested in ${data.title}...` }));
      })
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
    fetchSimilarProperties(slug).then(setSimilar).catch(() => setSimilar([]));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitInquiry({ ...form, property: property.id });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (loading) {
    return <div className="container-page py-24 text-center text-muted">Loading property…</div>;
  }
  if (!property) {
    return <div className="container-page py-24 text-center text-muted">Property not found.</div>;
  }

  const images = property.images?.length ? property.images : [{ image: PLACEHOLDER }];

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Gallery */}
      <div className="relative rounded-card overflow-hidden aspect-[16/9] bg-charcoal/5">
        <img src={images[activeImage]?.image || PLACEHOLDER} alt={property.title} className="h-full w-full object-cover" />
        {property.is_top_choice && <span className="absolute top-5 left-5 badge-green">Top Choice</span>}
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 sm:flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`shrink-0 w-full sm:w-28 aspect-[4/3] rounded-lg overflow-hidden border-2 ${
                i === activeImage ? "border-green" : "border-transparent"
              }`}
            >
              <img src={img.image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-charcoal/10 pb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl">{property.title}</h1>
          <p className="flex items-center gap-2 text-muted mt-2 text-sm">
            <MapPin size={15} /> {property.full_address || property.location}
          </p>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-xs uppercase tracking-widest2 text-muted">Asking Price</p>
          <p className="font-serif text-3xl font-bold">
            {formatNaira(property.price)}
            {property.rent_period_display && (
              <span className="text-base font-normal text-muted">{property.rent_period_display}</span>
            )}
          </p>
          <span className="badge-chip mt-1 inline-block">{purchaseTypeBadge(property.purchase_type)}</span>
          <a href="#inquire" className="btn-primary w-full sm:w-auto mt-4">
            <Calendar size={14} /> Inquire Now
          </a>
        </div>
      </div>

      {/* Specs strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 py-8 border-b border-charcoal/10 text-center">
        {[
          { icon: Building2, label: "Category", value: property.category?.name },
          { icon: Ruler, label: "Size", value: property.size_sqm ? `${property.size_sqm} sqm` : "—" },
          { icon: Tag, label: "Purchase Type", value: property.purchase_type_display },
          { icon: BedDouble, label: "Bedrooms", value: property.bedrooms ?? "—" },
          { icon: Bath, label: "Bathrooms", value: property.bathrooms ?? "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <div className="mx-auto h-11 w-11 rounded-full bg-cream flex items-center justify-center mb-2">
              <Icon size={17} className="text-green" />
            </div>
            <p className="text-[11px] uppercase tracking-widest2 text-muted">{label}</p>
            <p className="font-semibold text-sm mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12 mt-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl">Property Overview</h2>
            <div className="mt-4 space-y-4 text-sm text-muted leading-relaxed">
              {(property.description || property.summary || "").split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl mb-4">Premium Amenities</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.amenities.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 text-sm">
                    <span className="text-green"><Check size={16} /></span>
                    {a.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl sm:text-3xl mb-4">Location</h2>
            <p className="flex items-center gap-2 text-sm text-muted mb-4">
              <MapPin size={15} /> {property.full_address || property.location}
            </p>
            <LocationMapPreview
              address={property.full_address || property.location}
              latitude={property.latitude}
              longitude={property.longitude}
            />
          </div>
        </div>

        {/* Inquiry form */}
        <div id="inquire" className="card p-6 h-fit sticky top-24">
          <h3 className="font-serif text-xl font-bold">Interested in this property?</h3>
          <p className="text-sm text-muted mt-2">
            Fill out the form below and our property consultants will contact you shortly.
          </p>
          {status === "done" ? (
            <p className="mt-6 text-sm text-green-700 bg-green-50 rounded-md p-4">
              Thanks — your inquiry has been sent. A consultant will reach out shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                required
                placeholder="Full Name"
                className="input-field"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Phone Number"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                required
                rows={4}
                className="input-field resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
                {status === "loading" ? "Sending…" : "Send Inquiry"}
              </button>
              <p className="text-xs text-muted">
                By sending this inquiry, you agree to our Terms of Service.
              </p>
              {status === "error" && (
                <p className="text-xs text-red-600">Something went wrong — please try again.</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="section-dark -mx-5 sm:-mx-6 lg:-mx-8 mt-16 px-5 sm:px-6 lg:px-8 py-16 rounded-t-3xl">
          <p className="text-xs uppercase tracking-widest2 text-green-100">Curated Collection</p>
          <div className="flex items-end justify-between mt-2 mb-8">
            <h2 className="text-2xl sm:text-3xl text-white">Similar Properties</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} showSpecs dark />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
