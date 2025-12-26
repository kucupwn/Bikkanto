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

  const passwordChange = document.getElementById(
    "btn-password-change"
  ) as HTMLButtonElement;
  if (passwordChange)
    passwordChange.addEventListener("click", (e) => {
      e.preventDefault();
      callback.onOpenPasswordChange();
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
