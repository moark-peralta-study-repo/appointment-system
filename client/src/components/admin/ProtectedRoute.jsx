import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import DogLoader from "./DogLoader";

// Wraps the /admin subtree. Waits for the profile query to settle,
// then lets the user in or bounces them to /admin/login.
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
		return <Navigate to="/admin/login" replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
