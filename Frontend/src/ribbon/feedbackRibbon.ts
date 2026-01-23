type FeedbackType = "success" | "error";

let currentRibbon: HTMLDivElement | null = null;

export function showFeedback(message: string, type: FeedbackType): void {
  if (currentRibbon) {
    const text = currentRibbon.querySelector("p");
    if (text) text.textContent = message;
    currentRibbon.className = `feedback-ribbon ${type} show`;
    return;
  }

  const ribbon = createFeedbackRibbon(message, type);
  currentRibbon = ribbon;
  document.body.appendChild(ribbon);

  requestAnimationFrame(() => {
    ribbon.classList.add("show");
  });

  setTimeout(() => {
    ribbon.classList.remove("show");
    ribbon.classList.add("hide");
  }, 3000);

  setTimeout(() => {
    ribbon.remove();
    currentRibbon = null;
  }, 4000);
}

function createFeedbackRibbon(
  message: string,
  type: FeedbackType,
): HTMLDivElement {
  const ribbon = document.createElement("div");
  ribbon.classList.add("feedback-ribbon", type);

  const text = document.createElement("p");
  text.textContent = message;

  ribbon.appendChild(text);

  return ribbon;
}
