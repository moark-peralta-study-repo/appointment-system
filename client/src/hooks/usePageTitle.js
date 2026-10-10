import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE = "Mutuals Paws Veterinary Clinic";

// Route path -> tab title. Keep in sync with App.jsx and the sidebar labels.
const TITLES = [
	["/book-appointment", "Book an Appointment"],
	["/client/login", "Sign In — Client Portal"],
	["/client/register", "Create Account — Client Portal"],
	["/client/dashboard", "Dashboard — Client Portal"],
	["/client/appointments", "My Appointments — Client Portal"],
	["/client/medical-records", "Medical Records — Client Portal"],
	["/client/profile", "My Profile — Client Portal"],
	["/client/settings", "Settings — Client Portal"],
	["/admin/login", "Sign In — Staff Portal"],
	["/admin/appointments", "Appointments — Staff Portal"],
	["/admin/patients", "Patients — Staff Portal"],
	["/admin/pet-owners", "Pet Owners — Staff Portal"],
	["/admin/veterinarians", "Veterinarians — Staff Portal"],
	["/admin/medical-records", "Medical Records — Staff Portal"],
	["/admin/reports", "Reports — Staff Portal"],
	["/admin/settings", "Settings — Staff Portal"],
	["/admin", "Dashboard — Staff Portal"],
];

/**
 * Sets document.title from the current route, so each page shows the right
 * name in the browser tab. Falls back to the clinic name (home / unknown).
 */
export default function usePageTitle() {
	const { pathname } = useLocation();

	useEffect(() => {
		const match = TITLES.find(([path]) => path === pathname);
		document.title = match ? match[1] : BASE;
	}, [pathname]);
}
