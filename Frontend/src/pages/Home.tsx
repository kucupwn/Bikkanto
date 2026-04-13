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
  text-decoration: none;
  cursor: pointer;
`;

const PageDescription = styled.p`
  font-size: 20px;
  margin-top: 1rem;
`;

const HorizontalLine = styled.hr`
  height: 1px;
  width: 350px;
  background-color: #8e8e8e;
  border: none;
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
              <PageDescription>Create a workout.</PageDescription>
            </GuideSection>
            <HorizontalLine />
            <GuideSection>
              <PageLink href="/exercises">Exercises</PageLink>
              <PageDescription>Collention of your exercises.</PageDescription>
            </GuideSection>
            <HorizontalLine />
            <GuideSection>
              <PageLink href="/history">History</PageLink>
              <PageDescription>
                Finished workouts are saved to history.
              </PageDescription>
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
