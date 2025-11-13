import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { header } from "./partials/header";
import { users } from "./users/users";

window.addEventListener("load", async () => {
  const currentUser = users.getCurrentUser();
  await header.init();
  header.toggleLoginButton(currentUser);
  document.documentElement.style.visibility = "visible";
});
