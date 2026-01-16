import { apiRequest, authHeaders } from "../api/apiRequest";
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
import { showFeedback } from "../ribbon/feedbackRibbon";

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
    showFeedback("Invalid username or password", "error");
    console.error(err.message);
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
    showFeedback("Registered successfully, redirecting to login...", "success");
    setTimeout(() => (window.location.href = "/login.html"), 3000);
  } catch (err: any) {
    showFeedback("Failed to add new user", "error");
    console.error(err.message);
  }
}

export async function getCurrentUserAllDetails(
  currentUser: AuthUser
): Promise<User | null> {
  if (!currentUser) {
    return null;
  }
  try {
    const res = await fetch(USERS_API_URL, {
      method: "GET",
      headers: authHeaders(),
    });

    const data: User = await res.json();

    return data;
  } catch (err: any) {
    showFeedback("Failed to get user details", "error");
    console.error(err.message);

    return null;
  }
}

export async function submitEditedUserData(
  data: Record<string, string>,
  editData: UserDataChange
): Promise<void> {
  const endpoint =
    editData === UserDataChange.UserData
      ? USERS_API_URL
      : CHANGE_PASSWORD_API_URL;

  try {
    await apiRequest(endpoint, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    window.location.reload();
  } catch (err: any) {
    showFeedback("Failed to update user data", "error");
    console.error(err.message);
  }
}
