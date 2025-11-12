import type { AuthUser } from "../types/user.types";

const loginForm = document.getElementById("login-form") as HTMLFormElement;

export class Users {
  private readonly apiUrl = "http://127.0.0.1:8000";

  public async login(username: string, password: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    await this.getToken(formData);

    window.location.href = "/index.html";
  }

  public logout(): void {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }

  private async getToken(formData: URLSearchParams): Promise<void> {
    const res = await fetch(`${this.apiUrl}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!res.ok) {
      alert("Invalid username or password!");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
  }

  public getCurrentUser(): AuthUser | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      id: payload.id,
      username: payload.sub,
      role: payload.role,
    };
  }
}

export const users = new Users();

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = (loginForm.username as HTMLInputElement).value;
  const password = (loginForm.password as HTMLInputElement).value;
  await users.login(username, password);
});
