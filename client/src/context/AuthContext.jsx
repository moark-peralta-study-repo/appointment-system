import { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, getToken, setToken, clearToken } from "../lib/api";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
	const queryClient = useQueryClient();

	// On load: if a token is stored, verify it with GET /auth/profile.
	// This is what makes refreshes "stay signed in" — the token in
	// localStorage is re-checked against the API on every page load.
	const { data, isFetching, isError } = useQuery({
		queryKey: ["profile"],
		queryFn: () => apiFetch("/auth/profile"),
		enabled: Boolean(getToken()),
		retry: false,
	});

	// Token rejected (expired/invalid) → drop it so isAuthed flips to false
	// and the protected routes bounce the user back to the login page.
	useEffect(() => {
		if (isError) clearToken();
	}, [isError]);

	// Login: POST /auth/login → store token + cache the user
	// so /auth/profile doesn't need a second round-trip.
	const loginMutation = useMutation({
		mutationFn: ({ email, password }) =>
			apiFetch("/auth/login", { method: "POST", body: { email, password } }),
		onSuccess: ({ token, user }) => {
			setToken(token);
			queryClient.setQueryData(["profile"], { user });
		},
	});

	const logout = useCallback(() => {
		clearToken();
		queryClient.setQueryData(["profile"], null);
	}, [queryClient]);

	const user = data?.user ?? null;
	// Wait only while a request is actually in flight. A disabled query
	// (no token — we just signed out) reports isPending but never fetches,
	// so it must count as settled: otherwise the guard's "checking your
	// session" loader spins forever.
	const isSettled = !isFetching;
	const isAuthed = isSettled && Boolean(user);

	return (
		<AuthContext.Provider
			value={{
				user,
				isSettled,
				isAuthed,
				login: loginMutation,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
