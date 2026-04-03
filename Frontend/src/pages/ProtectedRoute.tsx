import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const LoginNote = styled.h2`
  justify-self: center;
  margin: 1rem;
`;

export function isTokenExpired() {
  const expiry = localStorage.getItem("token_expiry");
  if (!expiry) return true;

  return Date.now() > Number(expiry);
}

export function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const expired = isTokenExpired();

  if (!isLoggedIn || expired) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");

    return <LoginNote>Please log in to access this page!</LoginNote>;
  }

  return <>{children}</>;
}
