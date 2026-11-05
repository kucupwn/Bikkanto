import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const STEP_MS = 45;

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Split-flap text: when `text` changes, every character cascades through
 * random flaps left to right before settling on the new value.
 */
function useFlap(text: string, animateOnMount: boolean, delay = 0) {
  const [shown, setShown] = useState(() =>
    animateOnMount ? text.replace(/\S/g, " ") : text,
  );
  // The text currently fully settled on the board. An interrupted cascade
  // (unmount, StrictMode re-run, new text) leaves it stale, so it restarts.
  const settled = useRef<string | null>(animateOnMount ? null : text);

  const reduced = prefersReducedMotion();

  useEffect(() => {
    // Reduced motion renders the text directly (see return below).
    if (settled.current === text || reduced) return;

    const target = text.split("");
    // Each position flips a few times, staggered so the board ripples.
    const settleAt = target.map((_, i) => 3 + i + Math.floor(Math.random() * 3));
    let step = 0;

    let id = 0;
    const tick = () => {
      step += 1;
      setShown(
        target
          .map((ch, i) => (ch === " " || step >= settleAt[i] ? ch : randomChar()))
          .join(""),
      );
      if (step >= Math.max(...settleAt, 0)) {
        window.clearInterval(id);
        settled.current = text;
      }
    };
    const startId = window.setTimeout(() => {
      id = window.setInterval(tick, STEP_MS);
    }, delay);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(id);
    };
  }, [text, delay, reduced]);

  return reduced ? text : shown;
}

type FlapSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<FlapSize, { font: string; cellW: string; cellH: string }> = {
  sm: { font: "18px", cellW: "0.9em", cellH: "1.5em" },
  md: { font: "26px", cellW: "0.86em", cellH: "1.45em" },
  lg: { font: "40px", cellW: "0.82em", cellH: "1.35em" },
  xl: { font: "clamp(40px, 7vw, 88px)", cellW: "0.8em", cellH: "1.3em" },
};

const Cells = styled.span<{ $size: FlapSize; $tone: Tone }>`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  font-family: var(--font-board);
  font-weight: 700;
  /* --flap-fit lets a parent shrink the board to fit (see Home's FitName). */
  font-size: calc(${({ $size }) => sizes[$size].font} * var(--flap-fit, 1));
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: ${({ $tone }) => toneColor[$tone]};
`;

const Word = styled.span`
  display: inline-flex;
  gap: 2px;
  margin-right: 0.3em;

  &:last-child {
    margin-right: 0;
  }
`;

const Cell = styled.span<{ $size: FlapSize }>`
  position: relative;
  display: inline-grid;
  place-items: center;
  width: ${({ $size }) => sizes[$size].cellW};
  height: ${({ $size }) => sizes[$size].cellH};
  background: linear-gradient(
    to bottom,
    var(--board-cell-hi) 0 50%,
    var(--board-cell) 50% 100%
  );
  border-radius: 2px;

  /* the split between the upper and lower flap */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: #050506;
  }
`;

type Tone = "default" | "amber" | "red" | "muted";

const toneColor: Record<Tone, string> = {
  default: "var(--board-ink)",
  amber: "var(--amber)",
  red: "var(--red)",
  muted: "var(--board-ink-2)",
};

const Plain = styled.span<{ $tone: Tone; $upper: boolean }>`
  font-variant-numeric: tabular-nums;
  ${({ $upper }) =>
    $upper &&
    css`
      text-transform: uppercase;
    `}
  color: ${({ $tone }) => toneColor[$tone]};
`;

interface Props {
  text: string | number;
  /** Render each character in its own flap cell. */
  cells?: boolean;
  size?: FlapSize;
  tone?: Tone;
  /** Pad numeric text to this many cells (e.g. reps 6 → " 6"). */
  pad?: number;
  animateOnMount?: boolean;
  /** Milliseconds to wait before the cascade starts. */
  delay?: number;
  className?: string;
}

export function FlapText({
  text,
  cells = false,
  size = "md",
  tone = "default",
  pad,
  animateOnMount = false,
  delay = 0,
  className,
}: Props) {
  const raw = String(text).toUpperCase();
  const value = pad ? raw.padStart(pad, " ") : raw;
  const shown = useFlap(value, animateOnMount, delay);

  if (!cells) {
    return (
      <Plain className={className} $tone={tone} $upper aria-label={raw}>
        <span aria-hidden="true">{shown}</span>
      </Plain>
    );
  }

  // Keep cell positions stable while the text cascades: split on the target's spaces.
  // Padded values (e.g. reps " 6") stay one word so the blank cell sits flush
  // against the digit, like a two-digit number, instead of a word gap away.
  const targetWords = pad ? [value] : value.split(" ");
  const starts = targetWords.map((_, i) =>
    targetWords.slice(0, i).reduce((sum, w) => sum + w.length + 1, 0),
  );
  const words = targetWords.map((word, i) =>
    shown.slice(starts[i], starts[i] + word.length).padEnd(word.length, " "),
  );

  return (
    <Cells
      className={className}
      $size={size}
      $tone={tone}
      role="text"
      aria-label={raw.trim()}
    >
      {words.map((word, wi) =>
        word.length === 0 ? (
          <Word key={wi} aria-hidden="true">
            <Cell $size={size}> </Cell>
          </Word>
        ) : (
          <Word key={wi} aria-hidden="true">
            {word.split("").map((ch, ci) => (
              <Cell key={ci} $size={size}>
                {ch}
              </Cell>
            ))}
          </Word>
        ),
      )}
    </Cells>
  );
}
