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

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GuideSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
`;

const PageLink = styled.a`
  font-size: 24px;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
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
        <>
          <WelcomeContainer>
            <h1>{`Welcome ${currentUser.username}!`}</h1>
          </WelcomeContainer>
          <GuideContainer>
            <GuideSection>
              <PageLink href="/roll">Roll</PageLink>
              <h3>Create a workout.</h3>
            </GuideSection>
            <GuideSection>
              <PageLink href="/exercises">Exercises</PageLink>
              <h3>Collention of your exercises.</h3>
            </GuideSection>
            <GuideSection>
              <PageLink href="/history">History</PageLink>
              <h3>Finished workouts are saved to history.</h3>
            </GuideSection>
          </GuideContainer>
        </>
      ) : (
        <WelcomeContainer>
          <h1>Welcome!</h1>
          <p>Please login for full experience.</p>
        </WelcomeContainer>
      )}
    </>
  );
}
