import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { header } from "./partials/header";
import { users } from "./users/users";
import { protectPage } from "./ui/protected";

window.addEventListener("load", async () => {
  const currentUser = users.getCurrentUser();
  protectPage(currentUser);
  await header.init();
  header.toggleLoginButton(currentUser);
  document.documentElement.style.visibility = "visible";
});
