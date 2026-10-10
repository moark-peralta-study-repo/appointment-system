// Data hooks for the client (pet owner) pages.
//
// The API layer (lib/api.js) attaches the JWT from localStorage, so these
// only run behind ClientProtectedRoute. Same shape as useAdminData.js —
// the server scopes /appointments and /pets to the logged-in owner.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, setToken } from "../lib/api";
import { formatDate } from "../utils/admin";

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

/**
 * Derived "notifications": pending appointments need attention (vet is
 * about to confirm), completed ones just arrived with new visit notes.
 * No notification model in the API yet — this is the honest version of
 * the dashboard bell, computed from data the owner already has.
 */
export function useNotifications() {
	const { data: appointments = [], isPending } = useMyAppointments();
	return {
		isPending,
		items: appointments
			.filter((a) => a.status === "pending" || a.status === "completed")
			.map((a) => ({
				id: a._id,
				kind: a.status === "pending" ? "confirm" : "notes",
				text:
					a.status === "pending"
						? `Your appointment for ${a.pet?.name ?? "your pet"} on ${formatDate(a.date)} is awaiting confirmation`
						: `New visit notes from ${a.vet ?? "the clinic"} for ${a.pet?.name ?? "your pet"} (${formatDate(a.date)})`,
				date: a.date,
			}))
			.sort((x, y) => new Date(y.date) - new Date(x.date)),
	};
}

/* ------------------------------------------------------------------ */
/* MUTATIONS — invalidate the ["client"] tree so every page refreshes. */
/* ------------------------------------------------------------------ */

function useInvalidateClient() {
	const qc = useQueryClient();
	return () => qc.invalidateQueries({ queryKey: ["client"] });
}

/** Cancel one of the owner's appointments. */
export function useCancelMyAppointment() {
	const onSuccess = useInvalidateClient();
	return useMutation({
		mutationFn: (id) => apiFetch(`/appointments/${id}`, { method: "DELETE" }),
		onSuccess,
	});
}

/** Register a new pet for the owner (server sets owner from the JWT). */
export function useCreateMyPet() {
	const onSuccess = useInvalidateClient();
	return useMutation({
		mutationFn: (body) => apiFetch("/pets", { method: "POST", body }),
		onSuccess,
	});
}

/** Edit one of the owner's pets. */
export function useUpdateMyPet() {
	const onSuccess = useInvalidateClient();
	return useMutation({
		mutationFn: ({ id, body }) =>
			apiFetch(`/pets/${id}`, { method: "PUT", body }),
		onSuccess,
	});
}

/** Delete one of the owner's pets. */
export function useDeleteMyPet() {
	const onSuccess = useInvalidateClient();
	return useMutation({
		mutationFn: (id) => apiFetch(`/pets/${id}`, { method: "DELETE" }),
		onSuccess,
	});
}

/** Update the owner's own profile (name/phone/email). */
export function useUpdateMyProfile() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body) => apiFetch("/auth/profile", { method: "PATCH", body }),
		onSuccess: ({ user }) => {
			// Keep the auth context user in sync so the sidebar name updates.
			qc.setQueryData(["profile"], (prev) =>
				prev ? { ...prev, user } : { user },
			);
			qc.invalidateQueries({ queryKey: ["client"] });
		},
	});
}

/**
 * Register a new pet-owner account (public flow: /client/register and the
 * booking wizard). Same endpoint the admin's "create owner" uses — the
 * server assigns role "user". On success the token is stored and the
 * ["profile"] query is cached so the caller is signed in immediately.
 */
export function useRegister() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ name, email, phone, password }) =>
			apiFetch("/auth/register", {
				method: "POST",
				body: { name, email, phone, password },
			}),
		onSuccess: ({ token, user }) => {
			setToken(token);
			qc.setQueryData(["profile"], { user });
			qc.invalidateQueries({ queryKey: ["client"] });
		},
	});
}

/** Change the signed-in user's password. */
export function useChangePassword() {
	return useMutation({
		mutationFn: ({ currentPassword, password }) =>
			apiFetch("/auth/password", {
				method: "POST",
				body: { currentPassword, password },
			}),
	});
}
