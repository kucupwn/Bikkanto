import styled from "styled-components";

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

const UserInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
  max-width: 300px;
`;

export function Login() {
  return (
    <>
      <UserInputWrapper>
        <span>Username</span>
        <input type="text" name="username" />
      </UserInputWrapper>
      <UserInputWrapper>
        <span>Password</span>
        <input type="password" name="password" />
      </UserInputWrapper>
    </>
  );
}
