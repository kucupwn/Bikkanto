import { useState } from "react";
import styled from "styled-components";
import { api } from "../api/api";

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

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleLogin() {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const res = await api.post<AuthResponse>("/auth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = res.data;

      const expiresIn = 6 * 60 * 60 * 1000;
      const expiryTime = Date.now() + expiresIn;

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("token_expiry", expiryTime.toString());

      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <LoginContainer>
        <UserInputWrapper>
          <span>Username</span>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </UserInputWrapper>
        <UserInputWrapper>
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </UserInputWrapper>
        <button onClick={handleLogin}>Login</button>
      </LoginContainer>
    </>
  );
}
