function showGroup(groupToShow: string): void {
  document.querySelectorAll<HTMLDivElement>(".group").forEach((group) => {
    group.classList.toggle("hidden", group.id !== groupToShow);
  });
}

document
  .querySelectorAll<HTMLButtonElement>("[data-group-btn]")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      showGroup(btn.dataset.target!);
    });
  });
