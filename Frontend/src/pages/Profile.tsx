import styled from "styled-components";
import type { User } from "../types/userTypes";
import { useState } from "react";

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
  const [email, setEmail] = useState<string>(currentUser.email);
  const [firstName, setFirstName] = useState<string>(currentUser.first_name);
  const [lastName, setLastName] = useState<string>(currentUser.last_name);

  return (
    <ProfileContainer>
      <span>Email</span>
      <DataWrapper>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={currentUser.email}
        />
        <button>Apply</button>
      </DataWrapper>
      <span>First name</span>
      <DataWrapper>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={currentUser.first_name}
        />
        <button>Apply</button>
      </DataWrapper>
      <span>Last name</span>
      <DataWrapper>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={currentUser.last_name}
        />
        <button>Apply</button>
      </DataWrapper>
      <span>Password</span>
      <button>Change</button>
    </ProfileContainer>
  );
}
