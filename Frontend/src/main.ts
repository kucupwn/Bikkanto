import "bootstrap/dist/css/bootstrap.min.css";
import { loadPartial } from "../partials/load.partials";

window.addEventListener("load", async () => {
  await loadPartial("header", "/partials/header.html");
  document.documentElement.style.visibility = "visible";
});
