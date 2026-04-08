import styled from "styled-components";
import type { User } from "../types/userTypes";

interface Props {
  currentUser: User;
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 1rem;
`;

const DataWrapper = styled.div`
  display: flex;
`;

export function Profile({ currentUser }: Props) {
  console.log(currentUser);
  return (
    <ProfileContainer>
      <span>Email</span>
      <DataWrapper>
        <input type="text" placeholder={currentUser.email} />
        <button>Apply</button>
      </DataWrapper>
      <span>First name</span>
      <DataWrapper>
        <input type="text" placeholder={currentUser.first_name} />
        <button>Apply</button>
      </DataWrapper>
      <span>Last name</span>
      <DataWrapper>
        <input type="text" placeholder={currentUser.last_name} />
        <button>Apply</button>
      </DataWrapper>
      <span>Password</span>
      <button>Change</button>
    </ProfileContainer>
  );
}
