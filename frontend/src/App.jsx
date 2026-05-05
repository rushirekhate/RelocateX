import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import ServiceDetails from "./pages/ServiceDetails"
import HouseShifting from "./pages/HouseShifting"
import TruckRental from "./pages/TruckRental"
import VehicleTransfer from "./pages/VehicleTransfer"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Specific routes pehle — warna :id inhe bhi match kar leta */}
      <Route path="/service/house" element={<HouseShifting />} />
      <Route path="/service/truck" element={<TruckRental />} />
      <Route path="/service/vehicle" element={<VehicleTransfer />} />
      {/* Dynamic route last mein */}
      <Route path="/service/:id" element={<ServiceDetails />} />
    </Routes>
  )
}

export default App