
/*import { useState } from "react";
import { TruckIcon, PhoneIcon, UserIcon, MapPinIcon } from "@heroicons/react/24/solid";

function TruckRental() {
  const [data, setData] = useState({
    pickup: "",
    drop: "",
    name: "",
    phone: "",
    truck: "",
    distance: ""
  });

  const [price, setPrice] = useState(null);

  const RATE_PER_KM = 13.4;

  const labourCharges = {
    "3 Wheeler": 300,
    "Tata Ace": 400,
    "Pickup": 500,
    "Truck": 800
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const calculate = () => {
    const distance = parseFloat(data.distance);
    const labour = labourCharges[data.truck] || 0;
    if (!isNaN(distance)) {
      const total = (distance * RATE_PER_KM) + labour;
      setPrice(total.toFixed(2));
    } else {
      setPrice(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 relative">
      <div className="relative p-6 md:p-10">
       
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 drop-shadow-lg">
            🚚 Fast & Affordable Truck Rentals
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Book your truck in seconds and get instant fare estimates
          </p>
        </div>

       
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-wrap gap-4 items-center justify-center 
                        transform transition duration-500 hover:scale-105 hover:shadow-2xl animate-slideUp">

          <div className="flex items-center gap-2 border p-3 rounded w-40">
            <MapPinIcon className="w-5 h-5 text-teal-600" />
            <input name="pickup" placeholder="Pickup"
              onChange={handleChange}
              className="outline-none w-full" />
          </div>

          <div className="flex items-center gap-2 border p-3 rounded w-40">
            <MapPinIcon className="w-5 h-5 text-teal-600" />
            <input name="drop" placeholder="Drop"
              onChange={handleChange}
              className="outline-none w-full" />
          </div>

          <div className="flex items-center gap-2 border p-3 rounded w-40">
            <UserIcon className="w-5 h-5 text-teal-600" />
            <input name="name" placeholder="Name"
              onChange={handleChange}
              className="outline-none w-full" />
          </div>

          <div className="flex items-center gap-2 border p-3 rounded w-40">
            <PhoneIcon className="w-5 h-5 text-teal-600" />
            <input name="phone" placeholder="Phone"
              onChange={handleChange}
              className="outline-none w-full" />
          </div>

          <select name="truck"
            onChange={handleChange}
            className="border p-3 rounded w-40 focus:ring-2 focus:ring-indigo-500 transition duration-300">
            <option>Select Truck</option>
            <option>3 Wheeler</option>
            <option>Tata Ace</option>
            <option>Pickup</option>
            <option>Truck</option>
          </select>

          <input name="distance" placeholder="Distance (km)"
            onChange={handleChange}
            className="border p-3 rounded w-40 focus:ring-2 focus:ring-indigo-500 transition duration-300" />

          <button
            onClick={calculate}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md 
                       transition transform hover:scale-105 hover:bg-indigo-700">
            Get Fare →
          </button>
        </div>

       
        <div className="text-center mt-10 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Trucks to Choose From</h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-700 font-semibold">
            {["3 Wheeler", "Tata Ace", "Pickup", "Truck"].map((t) => (
              <span key={t} className="bg-teal-100 px-4 py-2 rounded shadow hover:scale-110 transition flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-teal-600" /> {t}
              </span>
            ))}
          </div>
        </div>

        {price && (
          <div className="mt-10 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg animate-slideUp">
            <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">
              Estimated Price
            </h2>
            <table className="w-full border text-center">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-3 border">Distance</th>
                  <th className="p-3 border">Rate/km</th>
                  <th className="p-3 border">Labour</th>
                  <th className="p-3 border">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">{data.distance} km</td>
                  <td className="p-3 border">₹ {RATE_PER_KM}</td>
                  <td className="p-3 border">₹ {labourCharges[data.truck] || 0}</td>
                  <td className="p-3 border font-bold text-emerald-600">₹ {price}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

     
        <div className="mt-10 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg animate-fadeIn">
          <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">Rate Card</h2>
          <table className="w-full border text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Truck</th>
                <th className="p-3 border">Per KM</th>
                <th className="p-3 border">Labour</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-3 border">3 Wheeler</td><td className="p-3 border">₹13.4</td><td className="p-3 border">₹300</td></tr>
              <tr><td className="p-3 border">Tata Ace</td><td className="p-3 border">₹13.4</td><td className="p-3 border">₹400</td></tr>
              <tr><td className="p-3 border">Pickup</td><td className="p-3 border">₹13.4</td><td className="p-3 border">₹500</td></tr>
              <tr><td className="p-3 border">Truck</td><td className="p-3 border">₹13.4</td><td className="p-3 border">₹800</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TruckRental;*/
import { useState } from "react";

function TruckRental() {

  const [data, setData] = useState({
    pickup: "",
    drop: "",
    name: "",
    phone: "",
    truck: "3 Wheeler",
    distance: ""
  });

  const [price, setPrice] = useState(null);

  const RATE = 13.4;

  const labour = {
    "3 Wheeler": 300,
    "Tata Ace": 400,
    "Pickup": 500,
    "Truck": 800
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const total =
      (data.distance * RATE) + (labour[data.truck] || 0);

    setPrice(total.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
        🚚 Fast & Affordable Truck Rentals
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Book your truck in seconds and get instant fare estimates
      </p>

      {/* TOP INLINE FORM */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 justify-center">

        <input name="pickup" placeholder="Pickup"
          onChange={handleChange}
          className="border p-2 rounded w-36" />

        <input name="drop" placeholder="Drop"
          onChange={handleChange}
          className="border p-2 rounded w-36" />

        <input name="name" placeholder="Name"
          onChange={handleChange}
          className="border p-2 rounded w-36" />

        <input name="phone" placeholder="Phone"
          onChange={handleChange}
          className="border p-2 rounded w-36" />

        <select name="truck"
          onChange={handleChange}
          className="border p-2 rounded w-36">
          <option>3 Wheeler</option>
          <option>Tata Ace</option>
          <option>Pickup</option>
          <option>Truck</option>
        </select>

        <input name="distance" placeholder="Distance (km)"
          onChange={handleChange}
          className="border p-2 rounded w-36" />

        <button
          onClick={calculate}
          className="bg-blue-600 text-white px-5 rounded">
          Get Fare →
        </button>

      </div>

      {/* TRUCK SELECT */}
      <div className="text-center mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Trucks to Choose From
        </h2>

        <div className="flex justify-center gap-4 flex-wrap">
          {["3 Wheeler", "Tata Ace", "Pickup", "Truck"].map((t) => (
            <button
              key={t}
              onClick={() => setData({ ...data, truck: t })}
              className={`px-4 py-2 rounded ${
                data.truck === t
                  ? "bg-green-300"
                  : "bg-green-100"
              }`}
            >
              🚚 {t}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid md:grid-cols-2 gap-10 mt-10">

        {/* LEFT → INQUIRY FORM */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-bold mb-4">Quick Booking</h2>

          <div className="space-y-3">

            <input placeholder="Full Name"
              className="w-full border p-3 rounded" />

            <input placeholder="Contact Number"
              className="w-full border p-3 rounded" />

            <input placeholder="Email ID"
              className="w-full border p-3 rounded" />

            <input placeholder="City"
              className="w-full border p-3 rounded" />

            <input placeholder="Pickup Location"
              className="w-full border p-3 rounded" />

            <input placeholder="Drop Location"
              className="w-full border p-3 rounded" />

            <button className="w-full bg-blue-600 text-white p-3 rounded">
              Check Price →
            </button>

          </div>

        </div>

        {/* RIGHT → RATE TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold text-center mb-4 text-blue-600">
            Rate Card
          </h2>

          <table className="w-full border text-center">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Truck</th>
                <th className="p-3 border">Per KM</th>
                <th className="p-3 border">Labour</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-3 border">3 Wheeler</td>
                <td className="p-3 border">₹13.4</td>
                <td className="p-3 border">₹300</td>
              </tr>
              <tr>
                <td className="p-3 border">Tata Ace</td>
                <td className="p-3 border">₹13.4</td>
                <td className="p-3 border">₹400</td>
              </tr>
              <tr>
                <td className="p-3 border">Pickup</td>
                <td className="p-3 border">₹13.4</td>
                <td className="p-3 border">₹500</td>
              </tr>
              <tr>
                <td className="p-3 border">Truck</td>
                <td className="p-3 border">₹13.4</td>
                <td className="p-3 border">₹800</td>
              </tr>
            </tbody>

          </table>

          {/* RESULT */}
          {price && (
            <div className="mt-4 text-center text-green-600 font-bold">
              Estimated Price: ₹ {price}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default TruckRental;


