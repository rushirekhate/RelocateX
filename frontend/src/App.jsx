import { motion } from "framer-motion"
import { useState } from "react"

function App() {

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    pickupLocation: "",
    dropLocation: "",
    shiftDate: "",
    houseSize: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://localhost:7266/api/Booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert("Booking Created Successfully ✅")
      } else {
        alert("Something went wrong ❌")
      }

    } catch (error) {
      console.error(error)
      alert("Server not reachable ❌")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden relative">

      {/* Floating Background Effects */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-28 px-4 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-indigo-50"></div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Move Your Home
              <span className="block text-blue-600">Smart. Safe. Simple.</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              India’s most trusted relocation platform with verified packers and live tracking.
            </p>

            <div className="flex gap-4 flex-wrap mb-8 text-sm">
              <span className="bg-white shadow px-4 py-2 rounded-full">✔ ISO Certified</span>
              <span className="bg-white shadow px-4 py-2 rounded-full">✔ Verified Packers</span>
              <span className="bg-white shadow px-4 py-2 rounded-full">✔ Live Tracking</span>
            </div>

            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition">
                Book Now
              </button>

              <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition">
                Get Quote
              </button>
            </div>
          </motion.div>

          {/* BOOKING CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow-2xl rounded-3xl p-8 backdrop-blur-md"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Quick Booking
            </h2>

            <div className="space-y-4">

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">👤</span>
                <input name="fullName" onChange={handleChange}
                  type="text"
                  className="w-full pl-10 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Full Name" />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">📞</span>
                <input name="phone" onChange={handleChange}
                  type="tel"
                  className="w-full pl-10 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contact Number" />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">✉️</span>
                <input name="email" onChange={handleChange}
                  type="email"
                  className="w-full pl-10 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Email ID" />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">🏙️</span>
                <input name="city" onChange={handleChange}
                  className="w-full pl-10 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="City" />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">📍</span>
                <input name="pickupLocation" onChange={handleChange}
                  className="w-full pl-10 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Pickup Location" />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">📦</span>
                <input name="dropLocation" onChange={handleChange}
                  className="w-full pl-10 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Drop Location" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input name="shiftDate"
                  type="date"
                  onChange={handleChange}
                  className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />

                <select name="houseSize"
                  onChange={handleChange}
                  className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">House Size</option>
                  <option value="1RK">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK+">4BHK+</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:scale-105 transition shadow-lg">
                Check Price →
              </button>

            </div>
          </motion.div>
        </div>

        <motion.img
          src="/truck.png"
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          transition={{ duration: 2 }}
          className="absolute bottom-0 left-10 w-56 hidden md:block"
        />

      </section>


      {/* ================= SERVICES ================= */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              { icon: "🏠", title: "House Shifting", desc: "Complete household relocation with safety." },
              { icon: "📦", title: "Packing & Unpacking", desc: "Professional secure packaging services." },
              { icon: "🚛", title: "Truck Rental", desc: "Flexible truck rental for all sizes." },
              { icon: "🏍️", title: "Bike Transfer", desc: "Safe two-wheeler relocation." },
              { icon: "🏢", title: "Intercity Moving", desc: "City-to-city reliable shifting." },
              { icon: "👷", title: "Loading & Unloading", desc: "Trained manpower assistance." },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-blue-50 p-10 rounded-2xl shadow hover:shadow-2xl transition"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Limited Slots Available Today!
        </h2>
        <p className="mb-8 text-lg">
          Book now and get up to 20% discount on your move.
        </p>

        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:scale-105 transition shadow-lg">
          Book Your Move Now
        </button>
      </section>


      <footer className="bg-blue-700 text-white py-10 text-center">
        © 2026 RelocateX. All rights reserved.
      </footer>

    </div>
  )
}

export default App