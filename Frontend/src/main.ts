import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { header, loadPartial, setActiveNav } from "../partials/header";

window.addEventListener("load", async () => {
  await loadPartial(header, "/partials/header.html");
  document.documentElement.style.visibility = "visible";
  setActiveNav();
});
