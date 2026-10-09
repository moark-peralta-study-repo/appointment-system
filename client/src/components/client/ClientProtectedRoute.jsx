import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import DogLoader from "../admin/DogLoader";

// Wraps the /client subtree (dashboard onward). Waits for the profile
// query to settle, then lets the owner in or bounces to /client/login.
// Same pattern as ProtectedRoute for /admin.
function ClientProtectedRoute() {
	const { user, isSettled } = useAuth();

	if (!isSettled) {
		return (
			<div className="admin-loading">
				<DogLoader />
				<p>Checking your session…</p>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/client/login" replace />;
	}

	// Staff accounts don't use the pet-owner portal.
	if (user.role === "vet") {
		return <Navigate to="/admin" replace />;
	}

	return <Outlet />;
}

export default ClientProtectedRoute;
