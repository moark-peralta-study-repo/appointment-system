// styles now live in src/styles/* (imported from main.jsx — see refactor/style-split-tokens)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import Activity from "./pages/admin/Activity";
import Settings from "./pages/admin/Settings";
import Login from "./pages/Login";
import ClientRegister from "./pages/client/ClientRegister";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ClientLayout from "./components/client/ClientLayout";
import ClientProtectedRoute from "./components/client/ClientProtectedRoute";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientMedicalRecords from "./pages/client/ClientMedicalRecords";
import ClientProfile from "./pages/client/ClientProfile";
import ClientSettings from "./pages/client/ClientSettings";
import usePageTitle from "./hooks/usePageTitle";

// Inside the Router so usePageTitle can read the current route.
function TitleSync() {
	usePageTitle();
	return null;
}

function App() {
	return (
		<BrowserRouter>
			<TitleSync />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/book-appointment" element={<BookAppointment />} />

				<Route
					path="/client"
					element={<Navigate to="/login" replace />}
				/>

				{/* One sign-in page for clients AND staff. On success it routes
				by the account's role (vet → /admin, owner → /client/dashboard),
				so the old two separate logins are just legacy redirects. */}
				<Route path="/login" element={<Login />} />
				<Route
					path="/client/login"
					element={<Navigate to="/login" replace />}
				/>
				<Route
					path="/admin/login"
					element={<Navigate to="/login" replace />}
				/>
				<Route path="/client/register" element={<ClientRegister />} />
				{/* Post-register verification + password reset (public, no auth). */}
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route element={<ClientProtectedRoute />}>
					<Route path="/client" element={<ClientLayout />}>
						<Route
							index
							element={<Navigate to="/client/dashboard" replace />}
						/>
						<Route path="dashboard" element={<ClientDashboard />} />
						<Route path="appointments" element={<ClientAppointments />} />
						<Route path="medical-records" element={<ClientMedicalRecords />} />
						<Route path="profile" element={<ClientProfile />} />
						<Route path="settings" element={<ClientSettings />} />
					</Route>
				</Route>

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
						<Route path="activity" element={<Activity />} />
						<Route path="settings" element={<Settings />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
