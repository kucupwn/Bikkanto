const nav = document.getElementById("nav") as HTMLDivElement;

if (nav) {
  nav.innerHTML = `
  <div id="select-wrap">
    <a class="view-select" href="index.html">Home</a>
    <a class="view-select" href="roll.html">Roll</a>
    <a class="view-select" href="history.html">History</a>
  </div>`;
}
