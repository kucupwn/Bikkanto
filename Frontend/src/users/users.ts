import { type AuthUser } from "../types/user.types";
import { attachUserEventListeners } from "./usersEvents";
import { login, startAutoLogout } from "./usersLogin";
import { addNewUser } from "./usersApi";
import { openEditModal, openPasswordChangeModal } from "./usersModalForm";

export class Users {
  public currentUser: AuthUser | null;

  constructor() {
    this.currentUser = this.getCurrentUser();

    attachUserEventListeners({
      onLogin: async (username, password) => login(username, password),
      onRegister: async (form) => addNewUser(form),
      onOpenEdit: (editKey, label, sourceId) =>
        openEditModal(editKey, label, sourceId, this.currentUser),
      onOpenPasswordChange: () => openPasswordChangeModal(this.currentUser),
    });

    const token = localStorage.getItem("token");
    if (token) {
      startAutoLogout(token);
    }
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
