import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { header } from "./partials/header";
import { users } from "./users/users";
import { protectPage } from "./ui/protected";
import { setHomeUi } from "./ui/home";

window.addEventListener("load", async () => {
  const currentUser = users.getCurrentUser();
  protectPage(currentUser);

  await header.init();
  header.toggleLoginButton(currentUser);

  if (window.location.pathname === "/index.html") {
    setHomeUi(currentUser?.username || null);
  }

  document.documentElement.style.visibility = "visible";
});
