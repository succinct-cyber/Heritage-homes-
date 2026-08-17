import { useEffect, useState } from "react";
import { fetchTeam, submitInquiry } from "../api/endpoints.js";

const PLACEHOLDER = "https://placehold.co/480x560/1a1a1a/f9faf4?text=Heritage+Estates";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContact, setActiveContact] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    fetchTeam().then(setTeam).catch(() => setTeam([])).finally(() => setLoading(false));
  }, []);

  const openContact = (member) => {
    setActiveContact(member);
    setForm({ full_name: "", email: "", message: `Hi ${member.name}, I'd like to speak with you about...` });
    setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitInquiry({ ...form, team_member: activeContact.id });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container-page py-16 sm:py-20 text-center">
      <h1 className="text-4xl sm:text-5xl">Meet The Team</h1>
      <p className="text-muted mt-4 max-w-2xl mx-auto text-sm">
        Our consultants bring decades of specialized experience in the Nigerian luxury real
        estate market, offering unparalleled discretion and market insight.
      </p>

      <div className="mt-12 border-t border-charcoal/10 pt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-[4/5] bg-charcoal/5 rounded-card" />
              <div className="h-4 bg-charcoal/5 rounded w-2/3" />
              <div className="h-3 bg-charcoal/5 rounded w-1/2" />
            </div>
          ))}
        {team.map((member) => (
          <div key={member.id}>
            <div className="aspect-[4/5] rounded-card overflow-hidden">
              <img
                src={member.photo || PLACEHOLDER}
                alt={member.name}
                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <h3 className="font-serif text-lg font-bold mt-4">{member.name}</h3>
            <p className="text-sm text-muted">{member.title}</p>
            <span className="badge-chip mt-2 inline-block">{member.specialty_tag}</span>
            <button onClick={() => openContact(member)} className="btn-outline w-full mt-4 justify-between">
              Contact →
            </button>
          </div>
        ))}
      </div>

      {activeContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4" onClick={() => setActiveContact(null)}>
          <div className="card w-full max-w-md p-6 text-left" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold">Contact {activeContact.name}</h3>
            <p className="text-sm text-muted mt-1">{activeContact.title}</p>

            {status === "done" ? (
              <p className="mt-6 text-sm text-green-700 bg-green-50 rounded-md p-4">
                Thanks — your message has been sent.
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
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setActiveContact(null)} className="btn-outline flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={status === "loading"} className="btn-primary flex-1">
                    {status === "loading" ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
