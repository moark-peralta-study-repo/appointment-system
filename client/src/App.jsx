// styles now live in src/styles/* (imported from main.jsx — see refactor/style-split-tokens)
import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import BookAppointment from "./pages/BookAppointment";

import ProtectedRoute from "./components/admin/ProtectedRoute";
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

import ClientLogin from "./pages/client/ClientLogin";
import ClientRegister from "./pages/client/ClientRegister";
import ClientLayout from "./components/client/ClientLayout";
import ClientProtectedRoute from "./components/client/ClientProtectedRoute";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientMedicalRecords from "./pages/client/ClientMedicalRecords";
import ClientProfile from "./pages/client/ClientProfile";
import ClientSettings from "./pages/client/ClientSettings";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/book-appointment" element={<BookAppointment />} />

				<Route path="/client" element={<Navigate to="/client/login" replace />} />

        {/* Client routes — same pattern as /admin: the login page stands
        alone, everything else is behind ClientProtectedRoute which
        verifies /auth/profile, then ClientLayout renders the page in
        its <Outlet />. */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/register" element={<ClientRegister />} />
        <Route element={<ClientProtectedRoute />}>
        <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="appointments" element={<ClientAppointments />} />
            <Route path="medical-records" element={<ClientMedicalRecords />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="settings" element={<ClientSettings />} />
        </Route>
        </Route>

				{/* Staff login is a standalone page (no sidebar). */}
				<Route path="/admin/login" element={<AdminLogin />} />

				{/* Everything else under /admin is behind the token guard:
					ProtectedRoute verifies /auth/profile, then AdminLayout
					renders the page content in its <Outlet />. */}
				<Route element={<ProtectedRoute />}>
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
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
