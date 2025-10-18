export const header = document.querySelector("header") as HTMLHeadingElement;

export async function loadPartial(header: HTMLHeadingElement, path: string) {
  const el = header;
  if (!el) return;

  const res = await fetch(path);

  if (!res.ok) {
    console.log(`Failed to load ${path}:`, res.statusText);
    return;
  }

  el.innerHTML = await res.text();
}

export function setActiveNav() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
