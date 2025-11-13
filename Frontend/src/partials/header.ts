import type { AuthUser } from "../types/user.types";

export class Header {
  private header = document.querySelector("header") as HTMLHeadingElement;
  private loginButton: HTMLAnchorElement | null = null;
  private logoutButton: HTMLAnchorElement | null = null;

  public async init(): Promise<void> {
    await this.loadPartial();
    this.setActiveNav();

    this.loginButton = document.getElementById(
      "login-btn"
    ) as HTMLAnchorElement;
    this.logoutButton = document.getElementById(
      "logout-btn"
    ) as HTMLAnchorElement;
  }

  private async loadPartial() {
    const path = "src/partials/header.html";

    const res = await fetch(path);

    if (!res.ok) {
      console.log(`Failed to load ${path}:`, res.statusText);
      return;
    }

    this.header.innerHTML = await res.text();
  }

  private setActiveNav() {
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

  public toggleLoginButton(currentUser: AuthUser | null): void {
    if (currentUser) {
      this.loginButton?.classList.add("hidden");
      this.logoutButton?.classList.remove("hidden");
    } else {
      this.loginButton?.classList.remove("hidden");
      this.logoutButton?.classList.add("hidden");
    }
  }
}

export const header = new Header();
