import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/tailwind.css";
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
  </StrictMode>
);
