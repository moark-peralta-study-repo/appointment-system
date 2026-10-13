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
 * server assigns role "user".
 *
 * Self-service signup: the server sends the email OTP and returns NO token
 * (the account is activated on /verify-otp, which is where the token comes
 * from — see useVerifyOtp). The onSuccess here just clears stale state.
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
			if (token && user) {
				setToken(token);
				qc.setQueryData(["profile"], { user });
			}
			qc.invalidateQueries({ queryKey: ["client"] });
		},
	});
}

/**
 * Confirm the 6-digit email code after registration. On success the server
 * returns a JWT — store it so the caller can continue immediately (the
 * register page hands off to the dashboard, the booking wizard continues).
 */
export function useVerifyOtp() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ email, otp }) =>
			apiFetch("/auth/verify-otp", { method: "POST", body: { email, otp } }),
		onSuccess: ({ token, user }) => {
			if (token && user) {
				setToken(token);
				qc.setQueryData(["profile"], { user });
				qc.invalidateQueries({ queryKey: ["client"] });
			}
		},
	});
}

/** Re-send a verification code (60s cooldown enforced server-side). */
export function useResendOtp() {
	return useMutation({
		mutationFn: (email) =>
			apiFetch("/auth/resend-otp", { method: "POST", body: { email } }),
	});
}

/** Request a password reset email. Always resolves (server hides unknown emails). */
export function useForgotPassword() {
	return useMutation({
		mutationFn: (email) =>
			apiFetch("/auth/forgot-password", { method: "POST", body: { email } }),
	});
}

/** Apply a new password using the token from the reset email link. */
export function useResetPassword() {
	return useMutation({
		mutationFn: ({ token, password }) =>
			apiFetch("/auth/reset-password", { method: "POST", body: { token, password } }),
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
