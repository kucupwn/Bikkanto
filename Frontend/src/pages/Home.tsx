import type { User } from "../types/userTypes";
import styled from "styled-components";

interface Props {
  currentUser: User;
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

export function Home({ currentUser }: Props) {
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
