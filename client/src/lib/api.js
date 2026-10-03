// Thin fetch wrapper for the Express API.
// Every call goes through here so the auth token and error
// handling live in ONE place instead of being repeated in each component.
const API_URL = import.meta.env.VITE_API_URL;

export function getToken() {
	return localStorage.getItem("token");
}

export function setToken(token) {
	localStorage.setItem("token", token);
}

export function clearToken() {
	localStorage.removeItem("token");
}

export async function apiFetch(path, { method = "GET", body } = {}) {
	const headers = { "Content-Type": "application/json" };
	const token = getToken();
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(`${API_URL}${path}`, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		const err = new Error(data.message || `Request failed (${res.status})`);
		err.status = res.status;
		throw err;
	}

	return data;
}
