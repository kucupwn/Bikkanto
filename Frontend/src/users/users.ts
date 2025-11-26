import type { AuthUser, User } from "../types/user.types";
import {
  setModalHeaderTitle,
  setCurrentProfileTextContent,
  getNewUserFormData,
} from "./users.utils";
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
        this.openEditModal("first_name", "first name", "firstname-paragraph");
      });

    const lastnameEdit = document.getElementById(
      "lastname-edit"
    ) as HTMLButtonElement;
    if (lastnameEdit)
      lastnameEdit.addEventListener("click", () => {
        this.openEditModal("last_name", "last name", "lastname-paragraph");
      });

    const emailEdit = document.getElementById(
      "email-edit"
    ) as HTMLButtonElement;
    if (emailEdit)
      emailEdit.addEventListener("click", () => {
        this.openEditModal("email", "email", "email-paragraph");
      });
  }

  // --------------------------------------------------------------
  // LOGIN/LOGOUT
  // --------------------------------------------------------------

  public async login(username: string, password: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    await this.getToken(formData);

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

  public logout(): void {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
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

  private async addNewUser(formData: HTMLFormElement): Promise<void> {
    const data = getNewUserFormData(formData);
    if (!data) return;

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

  // --------------------------------------------------------------
  // GET USER DATA
  // --------------------------------------------------------------

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

  // --------------------------------------------------------------
  // USER DATA EDITING
  // --------------------------------------------------------------

  public async fillProfilePageWithCurrentData(
    currentUser: AuthUser
  ): Promise<void> {
    const userData = await this.getCurrentUserAllDetails(currentUser);
    const firstName = document.getElementById("firstname-paragraph");
    const lastName = document.getElementById("lastname-paragraph");
    const email = document.getElementById("email-paragraph");

    setCurrentProfileTextContent(firstName, userData?.first_name);
    setCurrentProfileTextContent(lastName, userData?.last_name);
    setCurrentProfileTextContent(email, userData?.email);
  }

  private openEditModal(
    editKey: string,
    headerLabel: string,
    sourceParagraphId: string
  ): void {
    setModalHeaderTitle(headerLabel);

    const modalEl = document.getElementById("profile-modal");
    if (!modalEl) return;

    const body = document.getElementById("profile-form-body");
    if (!body) return;

    const currentValue = sourceParagraphId
      ? (document.getElementById(sourceParagraphId)?.textContent ?? "")
      : "";
    body.innerHTML = `<input id="profile-input" name="${editKey}" type="text" class="form-control" placeholder="${currentValue}">`;

    const bootstrapModal = new Modal(modalEl);
    bootstrapModal.show();

    this.handleEditFormSubmit(bootstrapModal);
  }

  private handleEditFormSubmit(modal: any): void {
    const form = document.getElementById("profile-form") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data: Record<string, string> = {};

      formData.forEach((value, key) => {
        data[key] = String(value);
      });

      await this.submitEditedUserData(data);

      modal.hide();
      form.reset();
    };
  }

  private async submitEditedUserData(
    data: Record<string, string>
  ): Promise<void> {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${this.apiUrl}/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error response:", err);
        throw new Error(JSON.stringify(err));
      }

      window.location.reload();
    } catch (err) {
      console.error("Could not update user data:", err);
    }
  }
}

export const users = new Users();
