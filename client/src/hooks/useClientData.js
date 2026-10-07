// Data hooks for the client (pet owner) pages.
//
// The API layer (lib/api.js) attaches the JWT from localStorage, so these
// only run behind ClientProtectedRoute. Same shape as useAdminData.js —
// the server scopes both /appointments and /pets to the logged-in owner.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

/** This owner's appointments (server filters by owner id). */
export function useMyAppointments() {
	return useQuery({
		queryKey: ["client", "appointments"],
		queryFn: () => apiFetch("/appointments"),
	});
}

/** This owner's pets. */
export function useMyPets() {
	return useQuery({
		queryKey: ["client", "pets"],
		queryFn: () => apiFetch("/pets"),
	});
}

/** Cancel one of the owner's appointments. */
export function useCancelMyAppointment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id) => apiFetch(`/appointments/${id}`, { method: "DELETE" }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["client"] });
		},
	});
}
