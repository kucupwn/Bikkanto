import { getToken } from "./usersApi";

export async function login(username: string, password: string): Promise<void> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  await getToken(formData);

  if (localStorage.getItem("token")) {
    window.location.href = "/index.html";
  }
}

export function logout(): void {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

export function startAutoLogout(token: string): void {
  const payload = JSON.parse(atob(token.split(".")[1]));

  const expiry = payload.exp * 1000;
  const now = Date.now();
  const timeLeft = expiry - now;

  if (timeLeft <= 0) {
    logout();
    return;
  }

  setTimeout(() => {
    logout();
  }, timeLeft);
}
