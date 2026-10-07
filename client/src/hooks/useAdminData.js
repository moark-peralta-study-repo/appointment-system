// Data hooks for the admin (staff) pages.
//
// The API layer (lib/api.js) attaches the JWT from localStorage, so these
// queries only run behind ProtectedRoute. react-query caches per-key and
// mutations invalidate the cache — pages never hold their own fetch state.

import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

/** All appointments (vets see everything). Populates pet + owner + vet name. */
export function useAppointments() {
	return useQuery({
		queryKey: ["admin", "appointments"],
		queryFn: () => apiFetch("/appointments"),
	});
}

/** All pets (vets see all patients). owner is flattened to a name. */
export function usePets() {
	return useQuery({
		queryKey: ["admin", "pets"],
		queryFn: () => apiFetch("/pets"),
	});
}

/** All clinic users (vet roster + pet owners). */
export function useUsers() {
	return useQuery({
		queryKey: ["admin", "users"],
		queryFn: () => apiFetch("/vets/users"),
	});
}

/** Clinic stats: entity counts, byStatus, byDay (last 14 days). */
export function useStats() {
	return useQuery({
		queryKey: ["admin", "stats"],
		queryFn: () => apiFetch("/vets/stats"),
	});
}

/** Public vet directory (active profiles + schedule). */
export function useVets() {
	return useQuery({
		queryKey: ["vets"],
		queryFn: () => apiFetch("/vets"),
	});
}

/**
 * A vet's free slots for a given date (YYYY-MM-DD). Only queries when a
 * date is chosen, so the slot picker is driven by the vet + date selection.
 */
export function useVetFreeSlots(vetId, date) {
	return useQuery({
		queryKey: ["vets", vetId, "slots", date],
		queryFn: () => apiFetch(`/vets/${vetId}?date=${date}`),
		enabled: Boolean(vetId && date),
		retry: false,
	});
}

/* ------------------------------------------------------------------ */
/* MUTATIONS — every one invalidates the ["admin"] tree so tables,     */
/* dashboards and stats refresh together.                              */
/* ------------------------------------------------------------------ */

function useInvalidateAdmin() {
	const qc = useQueryClient();
	return () => {
		qc.invalidateQueries({ queryKey: ["admin"] });
		qc.invalidateQueries({ queryKey: ["vets"] });
		qc.invalidateQueries({ queryKey: ["stats"] });
	};
}

/** Book an appointment (owner or vet on the owner's behalf). */
export function useBookAppointment() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: (body) =>
			apiFetch("/appointments", { method: "POST", body }),
		onSuccess,
	});
}

/** Confirm / complete an appointment (vet). */
export function useUpdateAppointmentStatus() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: ({ id, status, vetNotes }) =>
			apiFetch(`/appointments/${id}/status`, {
				method: "PATCH",
				body: vetNotes !== undefined ? { status, vetNotes } : { status },
			}),
		onSuccess,
	});
}

/** Record a visit: patch a completed appointment's vetNotes. */
export function useAddVisitNote() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: ({ id, vetNotes }) =>
			apiFetch(`/appointments/${id}/status`, {
				method: "PATCH",
				body: { status: "completed", vetNotes },
			}),
		onSuccess,
	});
}

/** Cancel an appointment (vet, or owner on their own). */
export function useCancelAppointment() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: (id) => apiFetch(`/appointments/${id}`, { method: "DELETE" }),
		onSuccess,
	});
}

/** Register a patient (pet). Vet: include ownerId. */
export function useCreatePet() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: (body) => apiFetch("/pets", { method: "POST", body }),
		onSuccess,
	});
}

/** Edit a patient. */
export function useUpdatePet() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: ({ id, body }) =>
			apiFetch(`/pets/${id}`, { method: "PUT", body }),
		onSuccess,
	});
}

/** Delete a patient. */
export function useDeletePet() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: (id) => apiFetch(`/pets/${id}`, { method: "DELETE" }),
		onSuccess,
	});
}

/** Create a pet-owner account. */
export function useCreateOwner() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body) =>
			apiFetch("/auth/register", { method: "POST", body }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
	});
}

/** Create a veterinarian account + profile. */
export function useCreateVet() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: (body) => apiFetch("/vets", { method: "POST", body }),
		onSuccess,
	});
}

/** Edit a vet's profile (specialty / bio / schedule / active). */
export function useUpdateVet() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: ({ id, body }) =>
			apiFetch(`/vets/${id}`, { method: "PUT", body }),
		onSuccess,
	});
}

/** Deactivate a vet (soft delete — removed from the public directory). */
export function useDeactivateVet() {
	const onSuccess = useInvalidateAdmin();
	return useMutation({
		mutationFn: (id) => apiFetch(`/vets/${id}`, { method: "DELETE" }),
		onSuccess,
	});
}
