import styled from "styled-components";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 1rem;
`;

const DataWrapper = styled.div`
  display: flex;
`;

export function Profile() {
  return (
    <ProfileContainer>
      <span>Email</span>
      <DataWrapper>
        <input type="text" />
        <button>Apply</button>
      </DataWrapper>
      <span>First name</span>
      <DataWrapper>
        <input type="text" />
        <button>Apply</button>
      </DataWrapper>
      <span>Last name</span>
      <DataWrapper>
        <input type="text" />
        <button>Apply</button>
      </DataWrapper>
      <span>Password</span>
      <button>Change</button>
    </ProfileContainer>
  );
}
