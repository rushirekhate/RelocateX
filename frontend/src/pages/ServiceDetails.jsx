import { useState } from "react";

const prices = {
  "1bhk":     { label: "1 BHK Shifting",     pack: "₹5,000 – 7,000",  labour: "₹3,000 – 5,000" },
  "2bhk":     { label: "2 BHK Shifting",     pack: "₹6,000 – 8,000",  labour: "₹4,000 – 5,000" },
  "3bhk":     { label: "3 BHK Shifting",     pack: "₹8,000 – 12,000", labour: "₹5,000 – 6,000" },
  "fewgoods": { label: "Few Goods Shifting",  pack: "₹3,500 – 5,000",  labour: "₹2,000 – 3,000" },
  "car":      { label: "Car Shifting",        pack: "₹3,000 – 6,000",  labour: "₹1,000 – 3,000" },
  "bike":     { label: "Bike Shifting",       pack: "₹2,000 – 10,000", labour: "₹1,000 – 2,000" },
};

const reviews = [
  { initials: "RK", name: "Rahul Kumar",  city: "Mumbai → Pune",       stars: 5, text: "Very smooth 2 BHK shifting. Team was professional and packed everything carefully. Highly recommended!" },
  { initials: "PS", name: "Priya Sharma", city: "Delhi → Bangalore",   stars: 5, text: "Booked for car shifting. My car arrived without a single scratch. Great service at a fair price." },
  { initials: "AM", name: "Ankit Mehta",  city: "Hyderabad → Chennai", stars: 4, text: "Good overall experience for 1 BHK shifting. Slight delay but the team was cooperative and helpful." },
  { initials: "SD", name: "Sneha Desai",  city: "Pune → Nagpur",       stars: 5, text: "Excellent packing quality. No damage at all. Will definitely use again for next move!" },
];

const blogs = [
  { tag: "Packing Tips", title: "How to pack fragile items safely for a long-distance move", excerpt: "Learn the best techniques to wrap glassware, electronics, and artwork so they arrive intact.", meta: "5 min read · March 2025" },
  { tag: "Cost Guide",   title: "1 BHK shifting cost breakdown — what you really pay for",  excerpt: "A transparent look at packing, labour, transport and hidden charges so you can budget accurately.", meta: "4 min read · February 2025" },
  { tag: "Checklist",    title: "The ultimate moving day checklist for Indian households",   excerpt: "From booking utilities to notifying your bank — everything before, during and after your move.", meta: "6 min read · January 2025" },
];

function StarRating({ count }) {
  return (
    <div style={{ color: "#f59e0b", fontSize: 14, marginBottom: 6 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </div>
  );
}

function HouseShifting() {
  const [form, setForm] = useState({ fullName: "", contact: "", email: "", city: "", pickup: "", drop: "", date: "", houseSize: "" });
  const [priceResult, setPriceResult] = useState(null);
  const [highlighted, setHighlighted] = useState("1bhk");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "houseSize" && value) setHighlighted(value);
  };

  const checkPrice = () => {
    if (!form.houseSize) { alert("Please select a house size."); return; }
    setPriceResult(prices[form.houseSize]);
    setHighlighted(form.houseSize);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1px solid #d1d5db",
    borderRadius: 8, fontSize: 14, outline: "none", marginBottom: 12,
    backgroundColor: "#fff", color: "#111",
  };

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: 26, fontWeight: 600 }}>Packers & Movers — Quick Booking</h1>
          <p style={{ color: "#6b7280", marginTop: 6 }}>Trusted shifting services across India. Get instant price estimates.</p>
        </div>

        {/* Top Grid: Form + Table */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.5rem", alignItems: "start" }}>

          {/* Booking Form */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.25rem" }}>Quick Booking</h2>
            {[
              { name: "fullName",  placeholder: "Full Name",        type: "text"  },
              { name: "contact",   placeholder: "Contact Number",   type: "tel"   },
              { name: "email",     placeholder: "Email ID",         type: "email" },
              { name: "city",      placeholder: "City",             type: "text"  },
              { name: "pickup",    placeholder: "Pickup Location",  type: "text"  },
              { name: "drop",      placeholder: "Drop Location",    type: "text"  },
            ].map((f) => (
              <input key={f.name} name={f.name} type={f.type} placeholder={f.placeholder}
                value={form[f.name]} onChange={handleChange} style={inputStyle} />
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input type="date" name="date" value={form.date} onChange={handleChange} style={inputStyle} />
              <select name="houseSize" value={form.houseSize} onChange={handleChange} style={inputStyle}>
                <option value="">House Size</option>
                <option value="1bhk">1 BHK</option>
                <option value="2bhk">2 BHK</option>
                <option value="3bhk">3 BHK</option>
                <option value="fewgoods">Few Goods</option>
                <option value="car">Car Shifting</option>
                <option value="bike">Bike Shifting</option>
              </select>
            </div>
            <button onClick={checkPrice} style={{
              width: "100%", padding: "12px", background: "#2563eb", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4,
            }}>
              Check Price →
            </button>
            {priceResult && (
              <div style={{ marginTop: 12, padding: "1rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8 }}>
                <p style={{ fontSize: 13, color: "#1d4ed8" }}>{priceResult.label} — estimated cost:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1d4ed8", marginTop: 4 }}>
                  Packing: {priceResult.pack} &nbsp;|&nbsp; Labour: {priceResult.labour}
                </p>
              </div>
            )}
          </div>

          {/* Pricing Table */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.25rem" }}>Shifting Prices</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  {["Shifting Type", "Packing Prices", "Labour Costs"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(prices).map(([key, row]) => (
                  <tr key={key}
                    onClick={() => { setHighlighted(key); setForm((p) => ({ ...p, houseSize: key })); }}
                    style={{
                      borderBottom: "1px solid #f3f4f6", cursor: "pointer",
                      background: highlighted === key ? "#eff6ff" : "transparent",
                      transition: "background 0.15s",
                    }}>
                    <td style={{ padding: "10px 12px", color: highlighted === key ? "#1d4ed8" : "#111", fontWeight: highlighted === key ? 600 : 400 }}>
                      {row.label}
                      {key === "1bhk" && <span style={{ marginLeft: 6, fontSize: 11, background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: 999 }}>Popular</span>}
                    </td>
                    <td style={{ padding: "10px 12px", color: highlighted === key ? "#1d4ed8" : "#374151" }}>{row.pack}</td>
                    <td style={{ padding: "10px 12px", color: highlighted === key ? "#1d4ed8" : "#374151" }}>{row.labour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews */}
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "2rem 0 1rem" }}>What our customers say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {reviews.map((r) => (
            <div key={r.initials} style={{ background: "#fff", borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#1d4ed8", flexShrink: 0 }}>
                  {r.initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.city}</div>
                </div>
              </div>
              <StarRating count={r.stars} />
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{r.text}</p>
            </div>
          ))}
        </div>

        {/* Blogs */}
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "2rem 0 1rem" }}>Moving Tips & Blogs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", paddingBottom: "2rem" }}>
          {blogs.map((b) => (
            <div key={b.tag} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #e5e7eb", cursor: "pointer" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#2563eb", marginBottom: 6 }}>{b.tag}</div>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{b.title}</div>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{b.excerpt}</p>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>{b.meta}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default HouseShifting;