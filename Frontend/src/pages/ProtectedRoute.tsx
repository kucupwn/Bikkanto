import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const LoginNote = styled.h2`
  justify-self: center;
  margin: 1rem;
`;

export function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    return <LoginNote>Please log in to access this page!</LoginNote>;
  }

  return <>{children}</>;
}
