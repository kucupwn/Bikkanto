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

export function setHomeUi(username: string | null): void {
  const welcome = document.getElementById("welcome-text") as HTMLHeadingElement;
  const loginAdvice = document.getElementById(
    "login-advice-text"
  ) as HTMLParagraphElement;
  const guide = document.getElementById("guide-container");

  if (!welcome || !loginAdvice) return;

  if (username) {
    welcome.textContent = `Welcome ${username}!`;
    loginAdvice.textContent = "";
    guide?.classList.remove("hidden");
  } else {
    welcome.textContent = `Welcome!`;
    loginAdvice.textContent = "Please login for full experience.";
    guide?.classList.add("hidden");
  }
}
