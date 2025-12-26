import { type AuthUser } from "../types/user.types";
import { attachUserEventListeners } from "./usersEvents";
import { login, startAutoLogout } from "./usersLogin";
import { addNewUser } from "./usersApi";
import { openEditModal, openPasswordChangeModal } from "./usersModalForm";

export class Users {
  constructor() {
    attachUserEventListeners({
      onLogin: async (username, password) => login(username, password),
      onRegister: async (form) => addNewUser(form),
      onOpenEdit: (editKey, label, sourceId) =>
        openEditModal(editKey, label, sourceId),
      onOpenPasswordChange: () => openPasswordChangeModal(),
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
