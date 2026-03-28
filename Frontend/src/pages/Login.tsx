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

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UserInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-bottom: 1rem;
`;

export function Login() {
  return (
    <>
      <LoginContainer>
        <UserInputWrapper>
          <span>Username</span>
          <input type="text" name="username" />
        </UserInputWrapper>
        <UserInputWrapper>
          <span>Password</span>
          <input type="password" name="password" />
        </UserInputWrapper>
        <button>Login</button>
      </LoginContainer>
    </>
  );
}
