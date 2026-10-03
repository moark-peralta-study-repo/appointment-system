import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BookAppointment from "./pages/BookAppointment";

import AdminLayout from "./components/admin/AdminLayout";
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

				{/* Staff login is a standalone page (no sidebar). */}
				<Route path="/admin/login" element={<AdminLogin />} />

				{/* Everything else under /admin shares the AdminLayout shell,
					which renders the page content in its <Outlet />. */}
				<Route path="/admin" element={<AdminLayout />}>
					<Route index element={<AdminDashboard />} />
					<Route path="appointments" element={<Appointments />} />
					<Route path="patients" element={<Patients />} />
					<Route path="pet-owners" element={<PetOwners />} />
					<Route path="veterinarians" element={<Veterinarians />} />
					<Route path="medical-records" element={<MedicalRecords />} />
					<Route path="reports" element={<Reports />} />
					<Route path="settings" element={<Settings />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
