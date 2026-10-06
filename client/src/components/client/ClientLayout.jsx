import { Outlet } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";

// Layout wrapper for /client — mirrors AdminLayout: fixed sidebar +
// <Outlet /> for the active page.
function ClientLayout() {
	return (
		<div className="admin-layout">
			<ClientSidebar />

			<main className="admin-main">
				<Outlet />
			</main>
		</div>
	);
}

export default ClientLayout;
