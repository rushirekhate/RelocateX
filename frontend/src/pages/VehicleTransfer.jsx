import { useState } from "react"

const rates = {
  Bike:    { perKm: 10, labour: 500 },
  Scooter: { perKm: 9,  labour: 400 },
  Car:     { perKm: 15, labour: 1000 },
}

function VehicleTransfer() {

  const [data, setData] = useState({
    pickup: "",
    drop: "",
    name: "",
    phone: "",
    email: "",
    vehicleType: "Bike",
    distance: ""
  })

  const [price, setPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
    setPrice(null) // distance ya vehicle change hone pe price reset
  }

  const calculatePrice = () => {
    const dist = parseFloat(data.distance)
    if (!data.distance || isNaN(dist) || dist <= 0) {
      setMessage({ type: "error", text: "Please enter a valid distance in km." })
      return
    }
    setMessage(null)
    const selected = rates[data.vehicleType]
    const total = (dist * selected.perKm) + selected.labour + 200 // 200 = insurance
    setPrice(total)
  }

  const handleSubmit = async () => {
    if (!data.name.trim())  { setMessage({ type: "error", text: "Please enter your name." }); return }
    if (!data.phone.trim() || data.phone.length < 10) { setMessage({ type: "error", text: "Please enter a valid phone number." }); return }
    if (!data.email.trim() || !data.email.includes("@")) { setMessage({ type: "error", text: "Please enter a valid email." }); return }
    if (!data.pickup.trim()) { setMessage({ type: "error", text: "Please enter pickup location." }); return }
    if (!data.drop.trim())   { setMessage({ type: "error", text: "Please enter drop location." }); return }

    setLoading(true)
    setMessage(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:7266"
      const response = await fetch(`${apiUrl}/api/Booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.name,
          phone: data.phone,
          email: data.email,
          pickupLocation: data.pickup,
          dropLocation: data.drop,
          houseSize: `Vehicle: ${data.vehicleType}`,
          city: ""
        })
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Inquiry submitted! We will contact you soon." })
        setData({ pickup: "", drop: "", name: "", phone: "", email: "", vehicleType: "Bike", distance: "" })
        setPrice(null)
      } else {
        setMessage({ type: "error", text: "Something went wrong. Please try again." })
      }
    } catch {
      setMessage({ type: "error", text: "Server not reachable. Please try again later." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-2">
        🚗 Vehicle Transfer Service
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Safe & Affordable Vehicle Transport
      </p>

      {/* TOP HORIZONTAL FARE CALCULATOR */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 justify-center mb-6">

        <input name="pickup" value={data.pickup} placeholder="Pickup"
          onChange={handleChange}
          className="border p-2 rounded w-40" />

        <input name="drop" value={data.drop} placeholder="Drop"
          onChange={handleChange}
          className="border p-2 rounded w-40" />

        <select name="vehicleType" value={data.vehicleType}
          onChange={handleChange}
          className="border p-2 rounded w-40">
          <option>Bike</option>
          <option>Scooter</option>
          <option>Car</option>
        </select>

        <input name="distance" value={data.distance} placeholder="Distance (km)"
          type="number" min="1"
          onChange={handleChange}
          className="border p-2 rounded w-40" />

        <button
          onClick={calculatePrice}
          className="bg-blue-600 text-white px-6 rounded">
          Get Fare →
        </button>
      </div>

      {/* FARE RESULT */}
      {price && (
        <div className="text-center mb-6">
          <div className="inline-block bg-green-50 border border-green-200 text-green-700 px-8 py-4 rounded-xl text-lg font-bold">
            Estimated Fare: ₹{price.toLocaleString("en-IN")}
            <div className="text-sm font-normal text-green-600 mt-1">Includes labour + ₹200 insurance</div>
          </div>
        </div>
      )}

      {/* VEHICLE OPTIONS */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-3">Vehicles Available</h2>
        <div className="flex gap-3 justify-center">
          {["Bike", "Scooter", "Car"].map((v) => (
            <span key={v} className="bg-green-200 px-4 py-2 rounded">{v}</span>
          ))}
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT — INQUIRY FORM (fully controlled) */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Quick Inquiry</h2>

          <input name="name" value={data.name} placeholder="Full Name"
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded" />

          <input name="phone" value={data.phone} placeholder="Phone"
            type="tel" onChange={handleChange}
            className="w-full border p-2 mb-3 rounded" />

          <input name="email" value={data.email} placeholder="Email"
            type="email" onChange={handleChange}
            className="w-full border p-2 mb-3 rounded" />

          <input name="pickup" value={data.pickup} placeholder="Pickup Location"
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded" />

          <input name="drop" value={data.drop} placeholder="Drop Location"
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded" />

          {/* Feedback message */}
          {message && (
            <div className={`text-sm px-3 py-2 rounded mb-3 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* RIGHT — RATE TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-blue-600 font-bold mb-4 text-center">Rate Card</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Vehicle</th>
                <th className="border p-2">Per KM</th>
                <th className="border p-2">Labour</th>
                <th className="border p-2">Insurance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Bike</td>
                <td className="border p-2">₹10</td>
                <td className="border p-2">₹500</td>
                <td className="border p-2 text-center" rowSpan={3}>₹200</td>
              </tr>
              <tr>
                <td className="border p-2">Scooter</td>
                <td className="border p-2">₹9</td>
                <td className="border p-2">₹400</td>
              </tr>
              <tr>
                <td className="border p-2">Car</td>
                <td className="border p-2">₹15</td>
                <td className="border p-2">₹1000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TIPS */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-center mb-4">Tips for Vehicle Transport</h2>
        <ul className="text-gray-600 text-center space-y-2">
          <li>✔ Remove fuel before transport</li>
          <li>✔ Take photos before shipping</li>
          <li>✔ Use insurance for safety</li>
          <li>✔ Choose verified transporters</li>
        </ul>
      </div>

    </div>
  )
}

export default VehicleTransfer
