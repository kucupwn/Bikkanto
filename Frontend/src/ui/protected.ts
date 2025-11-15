import type { AuthUser } from "../types/user.types";

export function protectPage(user: AuthUser | null): boolean {
  const excludedPages = ["/index.html", "/login.html", "/register.html"];

  const path = window.location.pathname;

  if (excludedPages.includes(path)) {
    return false;
  }

  if (!user) {
    window.location.href = "/login.html";
    return true;
  } else {
    return false;
  }
}
