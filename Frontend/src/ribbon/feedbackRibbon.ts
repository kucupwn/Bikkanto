type FeedbackType = "success" | "error";

export function showFeedback(message: string, type: FeedbackType): void {
  const ribbon = createFeedbackRibbon(message, type);
  document.body.appendChild(ribbon);

  setTimeout(() => {
    ribbon.remove();
  }, 3000);
}

function createFeedbackRibbon(
  message: string,
  type: FeedbackType
): HTMLDivElement {
  const ribbon = document.createElement("div");
  ribbon.classList.add("feedback-ribbon", type);

  const text = document.createElement("p");
  text.textContent = message;

  ribbon.appendChild(text);

  return ribbon;
}
