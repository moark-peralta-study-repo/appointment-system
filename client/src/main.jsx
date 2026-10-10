import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/tailwind.css";
// Design tokens (always-emitted :root/.dark vars — plain CSS references these).
import "./styles/theme.css";
// Split styles — imported in the ORIGINAL App.css cascade order so
// specificity/ordering is preserved exactly.
import "./styles/base.css";
import "./styles/home.css";
import "./styles/booking.css";
import "./styles/services.css";
import "./styles/admin.css";
import "./styles/admin-appointments.css";
import "./styles/admin-patients.css";
import "./styles/admin-pet-owners.css";
import "./styles/admin-veterinarians.css";
import "./styles/admin-medical-records.css";
import "./styles/admin-reports.css";
import "./styles/admin-settings.css";
import "./styles/admin-login.css";
import "./styles/client.css";
import "./styles/dog.css";
import "./styles/admin-modals.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Don't refetch on re-focus/re-mount — session data rarely changes,
			// and stale-while-revalidate is enough for a demo-scale app.
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</QueryClientProvider>
	</StrictMode>,
);
