import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { LogIn } from "lucide-react";
import { Board, Button, Page } from "../components/ui";
import { FlapText } from "../components/FlapText";

interface Props {
  children: ReactNode;
  onLogin: () => void;
}

const Notice = styled(Board)`
  max-width: 640px;
  margin: 4rem auto 0;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  p {
    color: var(--board-ink-2);
  }
`;

const LOCKED_PAGES: Record<string, { title: string; message: string }> = {
  "/exercises": {
    title: "Exercises",
    message: "Log in to build your exercise library and set rep ranges for each level.",
  },
  "/workout": {
    title: "Workout",
    message: "Log in to roll a workout from your library and log your cycles.",
  },
  "/history": {
    title: "History",
    message: "Log in to see your finished workouts and statistics for any date range.",
  },
  "/profile": {
    title: "Profile",
    message: "Log in to see your profile and account settings.",
  },
};

const FALLBACK_PAGE = {
  title: "Boarding",
  message: "Log in to see your exercises, workouts, history and profile.",
};

export function isTokenExpired() {
  const expiry = localStorage.getItem("token_expiry");
  if (!expiry) return true;

  return Date.now() > Number(expiry);
}

export function ProtectedRoute({ children, onLogin }: Props) {
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const expired = isTokenExpired();

  if (!isLoggedIn || expired) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");

    const page = LOCKED_PAGES[pathname] ?? FALLBACK_PAGE;

    return (
      <Page>
        <Notice>
          <FlapText text={`${page.title} closed`} cells size="md" tone="amber" />
          <p>{page.message}</p>
          <Button $variant="primary" onClick={onLogin}>
            <LogIn size={18} aria-hidden="true" />
            Log in
          </Button>
        </Notice>
      </Page>
    );
  }

  return <>{children}</>;
}
