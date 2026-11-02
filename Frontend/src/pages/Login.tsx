import { useState, type FormEvent } from "react";
import styled from "styled-components";
import { api } from "../api/api";
import type { AuthResponse } from "../types/userTypes";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import { ModalBase } from "../components/ModalBase";
import { Button, Field, FieldLabel, Input } from "../components/ui";

interface Props {
  onClose: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Hint = styled.p`
  color: var(--ink-2);
  font-size: 15px;
`;

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-2);
  font-size: 15px;
`;

const SwitchLink = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: var(--amber);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;

  &:hover {
    color: var(--focus);
  }
`;

type AuthMode = "login" | "register" | "forgotPW";

const titles: Record<AuthMode, string> = {
  login: "Log in",
  register: "Create account",
  forgotPW: "Reset password",
};

export function Login({ onClose }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showRibbon } = useRibbon();

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
    } catch (err: any) {
      const message = err.response?.data?.detail;

      if (!message) {
        showRibbon("error", "Server is currently down.");
      } else {
        showRibbon("error", message);
      }
    }
  }

  async function handleRegister() {
    if (password !== verifyPassword) {
      showRibbon("error", "Passwords not matching.");
      return;
    }

    try {
      await api.post("/users/register", {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      });

      setMode("login");

      showRibbon("success", "Successful registration.");
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Could not register the new account.";
      showRibbon("error", message);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "forgotPW") return;

    setIsSubmitting(true);
    try {
      if (mode === "login") await handleLogin();
      else await handleRegister();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalBase
      onClose={onClose}
      title={titles[mode]}
      width={mode === "register" ? "520px" : "420px"}
    >
      <Form onSubmit={handleSubmit}>
        {mode !== "forgotPW" && (
          <>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
          </>
        )}

        {mode === "register" && (
          <>
            <Field>
              <FieldLabel>Verify password</FieldLabel>
              <Input
                type="password"
                autoComplete="new-password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <TwoCol>
              <Field>
                <FieldLabel>First name</FieldLabel>
                <Input
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Last name</FieldLabel>
                <Input
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Field>
            </TwoCol>
          </>
        )}

        {mode === "forgotPW" && (
          <>
            <Hint>
              Enter the email on your account. Password reset is not
              available yet.
            </Hint>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </>
        )}

        <Button
          type="submit"
          $variant="primary"
          $block
          disabled={isSubmitting || mode === "forgotPW"}
        >
          {mode === "login"
            ? "Log in"
            : mode === "register"
              ? "Create account"
              : "Send reset link"}
        </Button>
      </Form>

      <Footer>
        {mode === "login" ? (
          <>
            <span>
              New here?{" "}
              <SwitchLink type="button" onClick={() => setMode("register")}>
                Create an account
              </SwitchLink>
            </span>
            <SwitchLink type="button" onClick={() => setMode("forgotPW")}>
              Forgot password
            </SwitchLink>
          </>
        ) : mode === "register" ? (
          <span>
            Already have an account?{" "}
            <SwitchLink type="button" onClick={() => setMode("login")}>
              Log in
            </SwitchLink>
          </span>
        ) : (
          <SwitchLink type="button" onClick={() => setMode("login")}>
            Back to log in
          </SwitchLink>
        )}
      </Footer>
    </ModalBase>
  );
}
