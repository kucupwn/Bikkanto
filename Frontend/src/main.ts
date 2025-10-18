import "bootstrap/dist/css/bootstrap.min.css";
import { header, loadPartial, setActiveNav } from "../partials/header";

window.addEventListener("load", async () => {
  await loadPartial(header, "/partials/header.html");
  document.documentElement.style.visibility = "visible";
  setActiveNav();
});
