import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BookAppointment from "./pages/BookAppointment";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Appointments from "./pages/admin/Appointments";
import Patients from "./pages/admin/Patients";
import PetOwners from "./pages/admin/PetOwners";
import Veterinarians from "./pages/admin/Veterinarians";
import MedicalRecords from "./pages/admin/MedicalRecords";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/pet-owners" element={<PetOwners />} />
        <Route path="/admin/veterinarians" element={<Veterinarians />} />
        <Route path="/admin/medical-records" element={<MedicalRecords />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 