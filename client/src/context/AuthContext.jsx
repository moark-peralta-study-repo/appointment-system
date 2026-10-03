import { useEffect } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { apiFetch, getToken, setToken, clearToken } from "../lib/api";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
	const queryClient = useQueryClient();

	// On load: if a token is stored, verify it with GET /auth/profile.
	// This is what makes refreshes "stay signed in" — the token in
	// localStorage is re-checked against the API on every page load.
	const { data, isPending, isFetching, isError } = useQuery({
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

	const logout = () => {
		clearToken();
		queryClient.setQueryData(["profile"], undefined);
	};

	const user = data?.user ?? null;
	// In react-query v5, isPending stays true for DISABLED queries (no token
	// yet — nothing to check). Only wait while a request is actually in flight:
	// isPending && isFetching.
	const isSettled = !isPending || !isFetching;
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
