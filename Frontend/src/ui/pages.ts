import type { AuthUser } from "../types/user.types";
import { roll } from "../roll/roll";
import { exercisesTable } from "../exercises/exercises";
import { history } from "../history/history";
import { users } from "../users/users";

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

export async function loadCurrentPage(
  currentUser: AuthUser | null
): Promise<void> {
  const pageInitMap: Record<string, () => Promise<void>> = {
    "index.html": async () => setHomeUi(currentUser?.username || null),
    "profile.html": async () =>
      users.fillProfilePageWithCurrentData(currentUser),
    "roll.html": async () => await roll.init(),
    "exercises.html": async () => await exercisesTable.init(),
    "history.html": async () => await history.init(),
  };

  const currentPage = window.location.pathname.split("/").pop() || "";

  if (pageInitMap[currentPage]) {
    await pageInitMap[currentPage]();
  }
}
