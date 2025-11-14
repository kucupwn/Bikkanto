import { users } from "../users/users";

function setHomeUi(username: string | null): void {
  const welcome = document.getElementById("welcome-text") as HTMLHeadingElement;
  const loginAdvice = document.getElementById(
    "login-advice-text"
  ) as HTMLParagraphElement;

  if (!welcome || !loginAdvice) return;

  if (username) {
    welcome.textContent = `Welcome ${username}!`;
    loginAdvice.textContent = "";
  } else {
    welcome.textContent = `Welcome!`;
    loginAdvice.textContent = "Please login for full experience.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const username = users.getCurrentUser()?.username as string;
  setHomeUi(username);
});
