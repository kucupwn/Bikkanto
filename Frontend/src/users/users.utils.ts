import type { UserCallbacks } from "../types/user.types";

export function attachUserEventListeners(callback: UserCallbacks): void {
  const loginForm = document.getElementById("login-form") as HTMLFormElement;
  if (loginForm)
    loginForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = (loginForm.username as HTMLInputElement).value;
      const password = (loginForm.password as HTMLInputElement).value;
      await callback.onLogin(username, password);
    });

  const registerForm = document.getElementById(
    "register-form"
  ) as HTMLFormElement;
  if (registerForm)
    registerForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await callback.onRegister(registerForm);
    });

  const bindEdit = (
    buttonId: string,
    editKey: string,
    label: string,
    sourceId: string
  ) => {
    const el = document.getElementById(buttonId) as HTMLButtonElement;
    if (el)
      el.addEventListener("click", () =>
        callback.onOpenEdit(editKey, label, sourceId)
      );
  };

  bindEdit("firstname-edit", "first_name", "first name", "firstname-paragraph");
  bindEdit("lastname-edit", "last_name", "last name", "lastname-paragraph");
  bindEdit("email-edit", "email", "email", "email-paragraph");
}

export function setModalHeaderTitle(editData: string) {
  const title = document.getElementById("profile-modal-label");
  if (!title) return;

  title.textContent = `Change ${editData}`;
}

export function setCurrentProfileTextContent(
  element: HTMLElement | null,
  value: string | undefined
): void {
  if (element) {
    element.textContent = value || "";
  }
}

export function getEditInput(editKey: string, currentValue: string) {
  return `<input id="profile-input" name="${editKey}" type="text" class="form-control" placeholder="${currentValue}">`;
}

export function getNewUserFormData(formData: HTMLFormElement) {
  const fd = new FormData(formData);
  const data: Record<string, any> = {};

  fd.forEach((value, key) => (data[key] = value));

  if (data.password !== data.password2) {
    alert("Passwords do not match!");
    return;
  }

  delete data.password2;

  return data;
}
