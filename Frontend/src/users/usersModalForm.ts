import { Modal } from "bootstrap";
import { UserDataChange } from "../types/user.types";
import { submitEditedUserData } from "./usersApi";

export function openEditModal(
  editKey: string,
  headerLabel: string,
  sourceParagraphId: string
): void {
  const modalEl = document.getElementById("profile-modal");
  if (!modalEl) return;

  setModalHeaderTitle(headerLabel);

  const body = document.getElementById("profile-form-body");
  if (!body) return;

  const currentValue = sourceParagraphId
    ? (document.getElementById(sourceParagraphId)?.textContent ?? "")
    : "";
  body.innerHTML = getEditInput(editKey, currentValue);

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();

  handleEditFormSubmit(bootstrapModal);
}

export function getEditInput(editKey: string, currentValue: string): string {
  return `<input id="profile-input" name="${editKey}" type="text" class="form-control" placeholder="${currentValue}">`;
}

export function setModalHeaderTitle(editData: string) {
  const title = document.getElementById("profile-modal-label");
  if (!title) return;

  title.textContent = `Change ${editData}`;
}

export function handleEditFormSubmit(modal: bootstrap.Modal): void {
  const form = document.getElementById("profile-form") as HTMLFormElement;
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    await submitEditedUserData(data, UserDataChange.UserData);

    modal.hide();
    form.reset();
  };
}

export function openPasswordChangeModal(): void {
  const modalEl = document.getElementById("password-modal");
  if (!modalEl) return;

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();

  handlePasswordChangeFormSubmit(bootstrapModal);
}

export function handlePasswordChangeFormSubmit(modal: bootstrap.Modal): void {
  const form = document.getElementById("password-form") as HTMLFormElement;
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    if (data["new_password"] === data["new_password_verify"]) {
      delete data["new_password_verify"];
      submitEditedUserData(data, UserDataChange.Password);
    } else {
      alert("New passwords are not matching!");
      return;
    }

    modal.hide();
    form.reset();
  };
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
