import { motion, useScroll, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ChatBot from "../components/ChatBot"

// ── Animated counter hook ──────────────────────────────────────────────
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

// ── Typewriter hook ────────────────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 1800) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [text, setText] = useState("")

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), pause)
      return
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }
    const timeout = setTimeout(() => {
      setText(words[index].substring(0, subIndex))
      setSubIndex((prev) => prev + (deleting ? -1 : 1))
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, words, speed, pause])

  return text
}

// ── Stat card (separate component so hook rules are satisfied) ─────────
function StatCard({ label, target, suffix, visible, delay }) {
  const count = useCounter(target, 2000, visible)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center bg-blue-50 rounded-2xl py-8 px-4 hover:shadow-md transition-shadow"
    >
      <div className="text-4xl font-extrabold text-blue-600">
        {count.toLocaleString("en-IN")}{suffix}
      </div>
      <div className="text-gray-500 text-sm mt-1 font-medium">{label}</div>
    </motion.div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────
const services = [
  { id: "house",     emoji: "🏠", title: "House Shifting",      desc: "Complete household relocation with full safety guarantee.",  color: "from-blue-500 to-cyan-400" },
  { id: "packing",   emoji: "📦", title: "Packing & Unpacking", desc: "Professional secure packaging for all your belongings.",     color: "from-purple-500 to-pink-400" },
  { id: "truck",     emoji: "🚛", title: "Truck Rental",        desc: "Flexible truck rental for all load sizes.",                  color: "from-orange-500 to-amber-400" },
  { id: "vehicle",   emoji: "🏍️", title: "Bike Transfer",       desc: "Safe two-wheeler relocation across India.",                  color: "from-green-500 to-teal-400" },
  { id: "intercity", emoji: "🏢", title: "Intercity Moving",    desc: "Reliable city-to-city shifting with live tracking.",         color: "from-rose-500 to-pink-400" },
  { id: "loading",   emoji: "👷", title: "Loading & Unloading", desc: "Trained manpower for safe loading assistance.",              color: "from-indigo-500 to-blue-400" },
]

const stats = [
  { label: "Happy Customers",  target: 15000, suffix: "+" },
  { label: "Cities Covered",   target: 120,   suffix: "+" },
  { label: "Verified Packers", target: 500,   suffix: "+" },
  { label: "Success Rate",     target: 99,    suffix: "%" },
]

const navLinks = ["Services", "How It Works", "Pricing", "Contact"]

const steps = [
  { step: "01", icon: "📋", title: "Fill the Form",   desc: "Enter your details and shifting requirements" },
  { step: "02", icon: "💰", title: "Get Quote",       desc: "Receive instant price estimate from us" },
  { step: "03", icon: "✅", title: "Confirm Booking", desc: "Our team confirms your booking slot" },
  { step: "04", icon: "🚛", title: "We Relocate",     desc: "Sit back while we handle everything" },
]

// ══════════════════════════════════════════════════════════════════════
export default function Home() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  const [formData, setFormData] = useState({
    fullName: "", phone: "", email: "", city: "",
    pickupLocation: "", dropLocation: "", shiftDate: "", houseSize: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const typeText = useTypewriter(["House Shifting", "Bike Transfer", "Truck Rental", "Intercity Moving"])

  // Navbar scroll effect
  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setScrolled(y > 40))
    return unsub
  }, [scrollY])

  // Stats counter trigger on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!formData.fullName.trim())         return setMessage({ type: "error", text: "Please enter your full name." })
    if (formData.phone.length < 10)        return setMessage({ type: "error", text: "Please enter a valid phone number." })
    if (!formData.email.includes("@"))     return setMessage({ type: "error", text: "Please enter a valid email." })
    if (!formData.city.trim())             return setMessage({ type: "error", text: "Please enter your city." })
    if (!formData.pickupLocation.trim())   return setMessage({ type: "error", text: "Please enter pickup location." })
    if (!formData.dropLocation.trim())     return setMessage({ type: "error", text: "Please enter drop location." })
    if (!formData.shiftDate)               return setMessage({ type: "error", text: "Please select a shift date." })
    if (!formData.houseSize)               return setMessage({ type: "error", text: "Please select house size." })

    setLoading(true); setMessage(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:7266"
      const res = await fetch(`${apiUrl}/api/Booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setMessage({ type: "success", text: "🎉 Booking created! We'll contact you soon." })
        setFormData({ fullName: "", phone: "", email: "", city: "", pickupLocation: "", dropLocation: "", shiftDate: "", houseSize: "" })
      } else {
        setMessage({ type: "error", text: "Something went wrong. Please try again." })
      }
    } catch {
      setMessage({ type: "error", text: "Server not reachable. Please try again later." })
    } finally {
      setLoading(false)
    }
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  // ── RENDER ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ══════ NAVBAR ══════ */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              R
            </div>
            <span className={`text-xl font-bold transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
              Relocate<span className="text-blue-400">X</span>
            </span>
          </motion.div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button key={link} whileHover={{ y: -2 }}
                onClick={() => scrollTo(link.toLowerCase().replace(" ", "-"))}
                className={`text-sm font-medium transition-colors hover:text-blue-400 ${scrolled ? "text-gray-700" : "text-white/90"}`}>
                {link}
              </motion.button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("booking-form")}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-blue-200 hover:shadow-lg transition-all">
              Get Free Quote
            </motion.button>
          </div>

          {/* Hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className={`block w-6 h-0.5 rounded transition-colors ${scrolled ? "bg-gray-800" : "bg-white"}`} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
              className={`block w-6 h-0.5 rounded ${scrolled ? "bg-gray-800" : "bg-white"}`} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className={`block w-6 h-0.5 rounded transition-colors ${scrolled ? "bg-gray-800" : "bg-white"}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button key={link} onClick={() => { setMenuOpen(false); scrollTo(link.toLowerCase().replace(" ", "-")) }}
                  className="text-left text-gray-700 font-medium hover:text-blue-600 transition-colors">
                  {link}
                </button>
              ))}
              <button onClick={() => { setMenuOpen(false); scrollTo("booking-form") }}
                className="bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm">
                Get Free Quote
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500" />

        {/* Floating blobs */}
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-[-80px] w-[400px] h-[400px] bg-white rounded-full pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-100px] right-[-60px] w-[500px] h-[500px] bg-cyan-300 rounded-full pointer-events-none" />
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-2xl rotate-12 pointer-events-none" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-white/10 rounded-xl -rotate-6 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 grid md:grid-cols-2 gap-12 items-center w-full">

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              India's #1 Relocation Platform
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Move Your Home<br />
              <span className="text-cyan-300">Smart & Safe</span>
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-white/70 text-lg">We handle your</span>
              <span className="text-white font-bold text-lg min-w-[190px]">
                {typeText}<span className="animate-pulse">|</span>
              </span>
            </div>

            <p className="text-white/80 text-base mb-8 leading-relaxed max-w-md">
              Trusted by 15,000+ families across India. Verified packers, live tracking, and zero damage guarantee.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {["✔ ISO Certified", "✔ Verified Packers", "✔ Live Tracking", "✔ Zero Damage"].map((tag) => (
                <motion.span key={tag} whileHover={{ scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full border border-white/20 font-medium">
                  {tag}
                </motion.span>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }} whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("booking-form")}
                className="bg-white text-blue-600 font-bold px-7 py-3.5 rounded-xl shadow-lg text-sm">
                Get Free Quote →
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("services")}
                className="bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl border border-white/30 text-sm hover:bg-white/25 transition-all">
                Our Services
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT — BOOKING FORM */}
          <motion.div id="booking-form"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Quick Booking</h2>
            <p className="text-gray-400 text-sm text-center mb-6">Get instant price estimate</p>

            <div className="space-y-3">
              {[
                { name: "fullName",       placeholder: "Full Name",       type: "text"  },
                { name: "phone",          placeholder: "Contact Number",  type: "tel"   },
                { name: "email",          placeholder: "Email ID",        type: "email" },
                { name: "city",           placeholder: "City",            type: "text"  },
                { name: "pickupLocation", placeholder: "Pickup Location", type: "text"  },
                { name: "dropLocation",   placeholder: "Drop Location",   type: "text"  },
              ].map((f) => (
                <input key={f.name} name={f.name} value={formData[f.name]} onChange={handleChange}
                  type={f.type} placeholder={f.placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              ))}

              <div className="grid grid-cols-2 gap-3">
                <input name="shiftDate" value={formData.shiftDate} type="date" onChange={handleChange}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                <select name="houseSize" value={formData.houseSize} onChange={handleChange}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-500">
                  <option value="">House Size</option>
                  {["1RK","1BHK","2BHK","3BHK","4BHK+"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {message && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className={`text-sm px-4 py-3 rounded-xl ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {message.text}
                </motion.div>
              )}

              <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                onClick={handleSubmit} disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white text-sm transition-all ${
                  loading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-200"
                }`}>
                {loading ? "Submitting..." : "Check Price →"}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section ref={statsRef} className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} visible={statsVisible} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ══════ SERVICES ══════ */}
      <section id="services" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Our Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Professional relocation solutions for every need</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`/service/${s.id}`)}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  {s.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-4 text-blue-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Simple Process</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-14">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <motion.div key={item.step}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-blue-100 z-0" />}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-blue-400 mb-1">{item.step}</span>
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA BANNER ══════ */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-500">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Move?</h2>
          <p className="text-white/80 mb-8">Join 15,000+ families who trusted RelocateX for their relocation.</p>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.3)" }} whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("booking-form")}
            className="bg-white text-blue-600 font-bold px-10 py-4 rounded-xl shadow-xl text-sm">
            Book Now — It's Free →
          </motion.button>
        </motion.div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-sm">R</div>
              <span className="font-bold text-lg">Relocate<span className="text-cyan-400">X</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">India's most trusted relocation platform with verified packers and live tracking.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["House Shifting", "Truck Rental", "Bike Transfer", "Intercity Moving"].map(s => (
                <li key={s} className="hover:text-white cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📧 support@relocatex.in</li>
              <li>📞 +91 87667 35828</li>
              <li>📍 Pune, Maharashtra</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
          © 2026 RelocateX. All rights reserved.
        </div>
      </footer>

      <ChatBot />
    </div>
  )
}
