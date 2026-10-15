import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import DogLoader from "./DogLoader";
import { isPortal } from "../../utils/roles";

// Wraps the /admin subtree. Waits for the profile query to settle,
// then lets the user in or bounces them to /login.
function ProtectedRoute() {
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
		return <Navigate to="/login" replace />;
	}

	// Only staff (vet, front desk, admin) get the admin dashboard — pet
	// owners bounce to their portal instead of seeing an empty staff UI.
	if (!isPortal(user.role)) {
		return <Navigate to="/client/dashboard" replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
