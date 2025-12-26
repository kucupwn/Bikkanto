import { apiRequest } from "../api/apiRequest";
import {
  type AuthResponse,
  type AuthUser,
  type User,
  UserDataChange,
} from "../types/user.types";
import {
  TOKEN_API_URL,
  REGISTER_API_URL,
  USERS_API_URL,
  CHANGE_PASSWORD_API_URL,
} from "../api/urls";
import { startAutoLogout } from "./usersLogin";
import { getNewUserFormData } from "./usersModalForm";

export async function getToken(formData: URLSearchParams): Promise<void> {
  try {
    const data = await apiRequest<AuthResponse>(TOKEN_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    const token = data.access_token;
    localStorage.setItem("token", token);
    startAutoLogout(token);
  } catch (err: any) {
    alert(err.message || "Invalid username or password.");
  }
}

export async function addNewUser(formData: HTMLFormElement): Promise<void> {
  const data = getNewUserFormData(formData);
  if (!data) return;

  try {
    await apiRequest(REGISTER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify(data),
    });
    window.location.href = "/index.html";
  } catch (err: any) {
    alert(err.message || "Failed to add new user.");
  }
}

export async function getCurrentUserAllDetails(
  currentUser: AuthUser
): Promise<User | null> {
  if (!currentUser) {
    return null;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(USERS_API_URL, {
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

export async function submitEditedUserData(
  data: Record<string, string>,
  editData: UserDataChange
): Promise<void> {
  const token = localStorage.getItem("token");
  const endpoint =
    editData === UserDataChange.UserData
      ? USERS_API_URL
      : CHANGE_PASSWORD_API_URL;

  try {
    await apiRequest(endpoint, {
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
