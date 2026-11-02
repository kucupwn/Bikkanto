import type { ReactNode } from "react";
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

export function isTokenExpired() {
  const expiry = localStorage.getItem("token_expiry");
  if (!expiry) return true;

  return Date.now() > Number(expiry);
}

export function ProtectedRoute({ children, onLogin }: Props) {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const expired = isTokenExpired();

  if (!isLoggedIn || expired) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");

    return (
      <Page>
        <Notice>
          <FlapText text="Boarding closed" cells size="md" tone="amber" />
          <p>Log in to see your exercises, workouts and history.</p>
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
