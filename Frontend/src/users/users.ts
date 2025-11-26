import type { AuthUser, User } from "../types/user.types";
import { Modal } from "bootstrap";

export class Users {
  private readonly apiUrl = "http://127.0.0.1:8000";

  constructor() {
    this.attachEventListeners();

    const token = localStorage.getItem("token");
    if (token) {
      this.startAutoLogout(token);
    }
  }

  private attachEventListeners(): void {
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    if (loginForm)
      loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = (loginForm.username as HTMLInputElement).value;
        const password = (loginForm.password as HTMLInputElement).value;
        await this.login(username, password);
      });

    const registerForm = document.getElementById(
      "register-form"
    ) as HTMLFormElement;
    if (registerForm)
      registerForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.addNewUser(registerForm);
      });

    const firstnameEdit = document.getElementById(
      "firstname-edit"
    ) as HTMLButtonElement;
    if (firstnameEdit)
      firstnameEdit.addEventListener("click", () => {
        this.openEditModal();
      });
  }

  private openEditModal(): void {
    const modalEl = document.getElementById("settings-modal");
    if (!modalEl) return;

    const bootstrapModal = new Modal(modalEl);
    bootstrapModal.show();
  }

  public async login(username: string, password: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    await this.getToken(formData);

    window.location.href = "/index.html";
  }

  public logout(): void {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
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
    const token = data.access_token;
    localStorage.setItem("token", token);

    this.startAutoLogout(token);
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

  private async getCurrentUserAllDetails(
    currentUser: AuthUser
  ): Promise<User | null> {
    if (!currentUser) {
      return null;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${this.apiUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: User = await res.json();

      return data;
    } catch (err) {
      console.warn("Error loading data: ", err);

      return null;
    }
  }

  private getFormData(formData: HTMLFormElement) {
    const fd = new FormData(formData);
    const data: Record<string, any> = {};

    fd.forEach((value, key) => (data[key] = value));

    if (data.password !== data.password2) {
      alert("Passwords do not match!");
      return;
    }

    delete data.password2;

    return data;
  }

  private async addNewUser(formData: HTMLFormElement): Promise<void> {
    const data = this.getFormData(formData);

    try {
      const res = await fetch(`${this.apiUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error response:", err);
        throw new Error(JSON.stringify(err));
      }

      window.location.href = "/index.html";
    } catch (err) {
      console.warn("Error creating user: ", err);
    }
  }

  private startAutoLogout(token: string): void {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const expiry = payload.exp * 1000;
    const now = Date.now();
    const timeLeft = expiry - now;

    if (timeLeft <= 0) {
      this.logout();
      return;
    }

    setTimeout(() => {
      this.logout();
    }, timeLeft);
  }

  private setSettingsTextContent(
    element: HTMLElement | null,
    value: string | undefined
  ): void {
    if (element) {
      element.textContent = value || "";
    }
  }

  public async fillSettingsPage(currentUser: AuthUser): Promise<void> {
    const userData = await this.getCurrentUserAllDetails(currentUser);
    const firstName = document.getElementById("firstname-paragraph");
    const lastName = document.getElementById("lastname-paragraph");
    const email = document.getElementById("email-paragraph");

    this.setSettingsTextContent(firstName, userData?.first_name);
    this.setSettingsTextContent(lastName, userData?.last_name);
    this.setSettingsTextContent(email, userData?.email);
  }
}

export const users = new Users();
