import { useState } from "react";
import styled from "styled-components";
import { api } from "../api/api";
import type { AuthResponse } from "../types/userTypes";

interface Props {
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  min-width: 300px;
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

const SwitchLink = styled.span`
  cursor: pointer;
  color: blue;
`;

const SwitchText = styled.p`
  margin: 1rem;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
`;

type AuthMode = "login" | "register";

export function Login({ onClose }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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

  async function handleRegister() {
    try {
      api.post("/users/register", {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      });

      setMode("login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Overlay onClick={onClose}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          {mode === "login" ? (
            <ModalTitle>Login</ModalTitle>
          ) : (
            <ModalTitle>Register</ModalTitle>
          )}
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

          {mode === "register" && (
            <>
              <UserInputWrapper>
                <span>Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </UserInputWrapper>

              <UserInputWrapper>
                <span>First Name</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </UserInputWrapper>

              <UserInputWrapper>
                <span>Last Name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </UserInputWrapper>
            </>
          )}

          {mode === "login" ? (
            <button onClick={handleLogin}>Login</button>
          ) : (
            <button onClick={handleRegister}>Register</button>
          )}

          <SwitchText>
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <SwitchLink onClick={() => setMode("register")}>
                  Register
                </SwitchLink>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <SwitchLink onClick={() => setMode("login")}>Login</SwitchLink>
              </>
            )}
          </SwitchText>
        </ModalBox>
      </Overlay>
    </>
  );
}
