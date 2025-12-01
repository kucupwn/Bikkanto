import { Collapse } from "bootstrap";
import type { AuthUser } from "../types/user.types";
import { users } from "../users/users";

export class Header {
  private header = document.querySelector("header") as HTMLElement;
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

    this.attachEventListeners();
    this.initCollapse();
  }

  private attachEventListeners(): void {
    this.loginButton?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "login.html";
    });

    this.logoutButton?.addEventListener("click", (e) => {
      e.preventDefault();
      users.logout();
      window.location.href = "index.html";
    });
  }

  private initCollapse(): void {
    const collapseEl = document.getElementById("navbarNav");
    if (collapseEl) {
      new Collapse(collapseEl, { toggle: false });
    }
  }

  private async loadPartial(): Promise<void> {
    const res = await fetch("src/partials/header.html");
    if (!res.ok) throw new Error(`Failed to load header: ${res.statusText}`);
    this.header.innerHTML = await res.text();
  }

  private setActiveNav(): void {
    const navLinks = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === currentPage
      );
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
