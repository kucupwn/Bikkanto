import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { header } from "./partials/header";
import { users } from "./users/users";
import { protectPage } from "./ui/pages";
import { loadCurrentPage } from "./ui/pages";
import type { AuthUser } from "./types/user.types";

window.addEventListener("DOMContentLoaded", async () => {
  const currentUser = users.getCurrentUser() as AuthUser;
  protectPage(currentUser);

  await header.init();
  header.toggleLoginButton(currentUser);

  await loadCurrentPage(currentUser);

  document.documentElement.style.visibility = "visible";
});
