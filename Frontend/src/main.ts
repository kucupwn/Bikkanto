import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { header } from "./partials/header";
import { users } from "./users/users";
import { protectPage } from "./ui/protected";
import { setHomeUi } from "./ui/home";
import type { AuthUser } from "./types/user.types";

window.addEventListener("load", async () => {
  const currentUser = users.getCurrentUser() as AuthUser;
  protectPage(currentUser);

  await header.init();
  header.toggleLoginButton(currentUser);

  if (window.location.pathname === "/index.html") {
    setHomeUi(currentUser?.username || null);
  }

  if (window.location.pathname === "/profile.html") {
    users.fillProfilePageWithCurrentData(currentUser);
  }

  document.documentElement.style.visibility = "visible";
});
