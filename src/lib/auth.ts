// Minimal demo-only auth flag. NOT real authentication.
const KEY = "resolven_demo_auth";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return true; // SSR: don't block render
  return window.localStorage.getItem(KEY) === "true";
}

export function signIn() {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, "true");
}

export function signOut() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
