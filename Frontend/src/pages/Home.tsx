import { useEffect, useState } from "react";
import type { User } from "../types/userTypes";
import { api } from "../api/api";
import styled from "styled-components";

interface Props {
  isLoggedIn: boolean;
}

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: center;
`;

export function Home({ isLoggedIn }: Props) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  async function getCurrentUser() {
    if (isLoggedIn) {
      try {
        const res = api.get<User>("/users");
        const data = (await res).data;

        setCurrentUser(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCurrentUser({
        id: 0,
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "",
      });
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, [isLoggedIn]);

  return (
    <>
      {currentUser.username ? (
        <WelcomeContainer>
          <h2>{`Welcome ${currentUser.username}!`}</h2>
        </WelcomeContainer>
      ) : (
        <WelcomeContainer>
          <h2>Welcome!</h2>
          <p>Please login for full experience.</p>
        </WelcomeContainer>
      )}
    </>
  );
}
