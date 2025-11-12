import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { loadPartial, setActiveNav } from "./partials/header";
import { users } from "./users/users";

window.addEventListener("load", async () => {
  await loadPartial("src/partials/header.html");
  document.documentElement.style.visibility = "visible";
  setActiveNav();

  const loginButton = document.getElementById("login-btn") as HTMLAnchorElement;
  const logoutButton = document.getElementById(
    "logout-btn"
  ) as HTMLAnchorElement;

  const currentUser = users.getCurrentUser();
  if (currentUser) {
    loginButton.classList.add("hidden");
    logoutButton.classList.remove("hidden");
  } else {
    loginButton.classList.remove("hidden");
    logoutButton.classList.add("hidden");
  }

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    users.logout();
  });
});
