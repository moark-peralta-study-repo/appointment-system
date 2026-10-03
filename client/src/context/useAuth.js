import { createContext, useContext } from "react";

// Plain (non-component) file: the context + the hook live here so
// AuthContext.jsx can stay component-only (keeps Fast Refresh happy).
export const AuthContext = createContext(null);

export function useAuth() {
	return useContext(AuthContext);
}
