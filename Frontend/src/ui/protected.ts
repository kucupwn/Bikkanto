import { users } from "../users/users";

export function protectPage(): boolean {
  const user = users.getCurrentUser();
  if (!user) {
    window.location.href = "/login.html";
    return true;
  } else {
    return false;
  }
}
