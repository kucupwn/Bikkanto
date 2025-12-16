import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { header } from "./partials/header";
import { users } from "./users/users";
import { roll } from "./roll/roll";
import { exercisesTable } from "./exercises/exercises";
import { history } from "./history/history";
import { protectPage } from "./ui/protected";
import { setHomeUi } from "./ui/home";
import type { AuthUser } from "./types/user.types";

window.addEventListener("DOMContentLoaded", async () => {
  const currentUser = users.getCurrentUser() as AuthUser;
  protectPage(currentUser);

  await header.init();
  header.toggleLoginButton(currentUser);

  if (window.location.pathname.endsWith("index.html")) {
    setHomeUi(currentUser?.username || null);
  }

  if (window.location.pathname.endsWith("profile.html")) {
    users.fillProfilePageWithCurrentData(currentUser);
  }

  if (window.location.pathname.endsWith("history.html")) {
    await history.init();
  }

  if (window.location.pathname.endsWith("exercises.html")) {
    await exercisesTable.init();
  }

  if (window.location.pathname.endsWith("roll.html")) {
    await roll.init();
  }

  document.documentElement.style.visibility = "visible";
});
