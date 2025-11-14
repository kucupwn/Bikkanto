import { users } from "../users/users";

export function protectPage() {
  const user = users.getCurrentUser();
  if (!user) {
    window.location.href = "/login.html";
  }
}
