import { useLayoutEffect, useRef } from "react";
import type { User } from "../types/userTypes";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import { Board, BoardHead, BoardTitle, Button, Page } from "../components/ui";
import { FlapText } from "../components/FlapText";

interface Props {
  currentUser: User;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const Hero = styled(Board)`
  padding: 2.5rem 2rem 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 900px) {
    padding: 1.5rem 1rem;
  }
`;

const HeroText = styled.p`
  max-width: 56ch;
  color: var(--board-ink-2);
  font-size: 17px;
`;

const Row = styled(Link)`
  display: grid;
  grid-template-columns: 4.5rem minmax(8rem, 14rem) 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  border-bottom: 1px solid var(--board-line);
  color: var(--board-ink);
  text-decoration: none;
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: var(--board-cell);
  }

  &:hover svg {
    color: var(--amber);
    transform: translateX(3px);
  }

  svg {
    color: var(--board-ink-2);
    transition:
      transform 0.2s var(--ease-out),
      color 0.15s ease;
  }

  @media (max-width: 600px) {
    grid-template-columns: 3rem 1fr auto;

    > :nth-child(3) {
      grid-column: 2;
      grid-row: 2;
    }
  }
`;

const RowNo = styled.span`
  font-family: var(--font-board);
  font-size: 22px;
  font-weight: 700;
  color: var(--board-ink-2);
  font-variant-numeric: tabular-nums;
`;

const RowName = styled.span`
  font-family: var(--font-board);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const RowDesc = styled.span`
  color: var(--board-ink-2);
`;

const steps = [
  {
    path: "/exercises",
    name: "Exercises",
    desc: "Your categories and exercises, with easy, medium and hard rep ranges.",
  },
  {
    path: "/workout",
    name: "Workout",
    desc: "Roll a workout from your library, reroll any row, then log your cycles.",
  },
  {
    path: "/history",
    name: "History",
    desc: "Every finished workout, plus statistics for any date range.",
  },
];

const NameBox = styled.span`
  display: block;
  margin-top: 0.15em;
`;

/** The username on the board, scaled down until it fits the hero's width. */
function FitName({ name }: { name: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const fit = () => {
      box.style.setProperty("--flap-fit", "1");
      // Cells scale with the font but their 2px gaps don't, so refine a few times.
      let scale = 1;
      for (let i = 0; i < 4 && box.scrollWidth > box.clientWidth; i++) {
        // The 0.99 leaves room for subpixel rounding.
        scale *= (box.clientWidth / box.scrollWidth) * 0.99;
        box.style.setProperty("--flap-fit", String(scale));
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [name]);

  return (
    <NameBox ref={boxRef} aria-hidden="true">
      <FlapText text={name} cells size="xl" animateOnMount delay={360} />
    </NameBox>
  );
}

export function Home({ currentUser, isLoggedIn, onLogin }: Props) {
  const signedIn = isLoggedIn && !!currentUser.username;

  return (
    <Page>
      <Hero as="section">
        {signedIn ? (
          <h1 aria-label={`Welcome ${currentUser.username}`}>
            <FlapText text="Welcome" cells size="xl" animateOnMount />
            <FitName name={currentUser.username} />
          </h1>
        ) : (
          <h1>
            <FlapText text="Bikkanto" cells size="xl" animateOnMount />
          </h1>
        )}
        {signedIn ? (
          <HeroText>
            Pick up where you left off. Build your library, roll today's
            workout, and keep the history honest.
          </HeroText>
        ) : (
          <>
            <HeroText>
              Bodyweight workouts rolled from your own exercise library. Set
              rep ranges that match your level, pick categories and
              difficulty, and let the board pick the session.
            </HeroText>
            <div>
              <Button $variant="primary" $size="lg" onClick={onLogin}>
                <LogIn size={20} aria-hidden="true" />
                Log in or create an account
              </Button>
            </div>
          </>
        )}
      </Hero>

      <Board as="nav" aria-label="Get started">
        <BoardHead>
          <BoardTitle>How it works</BoardTitle>
        </BoardHead>
        {steps.map((step, i) => (
          <Row key={step.path} to={step.path}>
            <RowNo>{String(i + 1).padStart(2, "0")}</RowNo>
            <RowName>{step.name}</RowName>
            <RowDesc>{step.desc}</RowDesc>
            <ArrowRight size={20} aria-hidden="true" />
          </Row>
        ))}
      </Board>
    </Page>
  );
}
