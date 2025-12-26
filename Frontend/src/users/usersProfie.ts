import { type AuthUser } from "../types/user.types";
import { getCurrentUserAllDetails } from "./usersApi";

export async function fillProfilePageWithCurrentData(
  currentUser: AuthUser | null
): Promise<void> {
  if (!currentUser) return;

  const userData = await getCurrentUserAllDetails(currentUser);
  const firstName = document.getElementById("firstname-paragraph");
  const lastName = document.getElementById("lastname-paragraph");
  const email = document.getElementById("email-paragraph");

  setCurrentProfileTextContent(firstName, userData?.first_name);
  setCurrentProfileTextContent(lastName, userData?.last_name);
  setCurrentProfileTextContent(email, userData?.email);
}

export function setCurrentProfileTextContent(
  element: HTMLElement | null,
  value: string | undefined
): void {
  if (element) {
    element.textContent = value || "";
  }
}
