export async function loadPartial(selector: string, path: string) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(path);

  if (!res.ok) {
    console.log(`Failed to load ${path}:`, res.statusText);
    return;
  }

  el.innerHTML = await res.text();
}
