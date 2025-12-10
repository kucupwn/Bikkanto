import {
  UserDataChange,
  type AuthUser,
  type User,
  type AuthResponse,
} from "../types/user.types";
import {
  attachUserEventListeners,
  setModalHeaderTitle,
  setCurrentProfileTextContent,
  getNewUserFormData,
  getEditInput,
} from "./usersUtils";
import { apiRequest } from "../api/apiRequest";
import { Modal } from "bootstrap";

export class Users {
  private readonly apiUrl = "http://127.0.0.1:8000";

  constructor() {
    attachUserEventListeners({
      onLogin: async (username, password) => this.login(username, password),
      onRegister: async (form) => this.addNewUser(form),
      onOpenEdit: (editKey, label, sourceId) =>
        this.openEditModal(editKey, label, sourceId),
      onOpenPasswordChange: () => this.openPasswordChangeModal(),
    });

    const token = localStorage.getItem("token");
    if (token) {
      this.startAutoLogout(token);
    }
  }

  // --------------------------------------------------------------
  // LOGIN/LOGOUT
  // --------------------------------------------------------------

  public async login(username: string, password: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    await this.getToken(formData);

    if (localStorage.getItem("token")) {
      window.location.href = "/index.html";
    }
  }

  private async getToken(formData: URLSearchParams): Promise<void> {
    try {
      const data = await apiRequest<AuthResponse>(`${this.apiUrl}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      const token = data.access_token;
      localStorage.setItem("token", token);
      this.startAutoLogout(token);
    } catch (err: any) {
      alert("Invalid username or password.");
    }
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
    const modalEl = document.getElementById("profile-modal");
    if (!modalEl) return;

    setModalHeaderTitle(headerLabel);

    const body = document.getElementById("profile-form-body");
    if (!body) return;

    const currentValue = sourceParagraphId
      ? (document.getElementById(sourceParagraphId)?.textContent ?? "")
      : "";
    body.innerHTML = getEditInput(editKey, currentValue);

    const bootstrapModal = new Modal(modalEl);
    bootstrapModal.show();

    this.handleEditFormSubmit(bootstrapModal);
  }

  private handleEditFormSubmit(modal: bootstrap.Modal): void {
    const form = document.getElementById("profile-form") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data: Record<string, string> = {};

      formData.forEach((value, key) => {
        data[key] = String(value);
      });

      await this.submitEditedUserData(data, UserDataChange.UserData);

      modal.hide();
      form.reset();
    };
  }

  private openPasswordChangeModal(): void {
    const modalEl = document.getElementById("password-modal");
    if (!modalEl) return;

    const bootstrapModal = new Modal(modalEl);
    bootstrapModal.show();

    this.handlePasswordChangeFormSubmit(bootstrapModal);
  }

  private handlePasswordChangeFormSubmit(modal: bootstrap.Modal): void {
    const form = document.getElementById("password-form") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data: Record<string, string> = {};

      formData.forEach((value, key) => {
        data[key] = String(value);
      });

      if (data["new_password"] === data["new_password_verify"]) {
        delete data["new_password_verify"];
        this.submitEditedUserData(data, UserDataChange.Password);
      } else {
        alert("New passwords are not matching!");
        return;
      }

      modal.hide();
      form.reset();
    };
  }

  private async submitEditedUserData(
    data: Record<string, string>,
    editData: UserDataChange
  ): Promise<void> {
    const token = localStorage.getItem("token");
    const endpoint =
      editData === UserDataChange.UserData ? "users" : "users/change_password";

    try {
      await apiRequest(`${this.apiUrl}/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to update user data.");
    }
  }
}

export const users = new Users();
