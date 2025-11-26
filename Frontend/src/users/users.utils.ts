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
