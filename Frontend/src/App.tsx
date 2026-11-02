import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/nav/Navbar";
import { Home } from "./pages/Home";
import { Workout } from "./pages/Workout";
import { Exercises } from "./pages/Exercises";
import { History } from "./pages/History";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { useEffect, useState } from "react";
import { Profile } from "./pages/Profile";
import type { User } from "./types/userTypes";
import { api } from "./api/api";
import { useTheme } from "./components/ThemeProvider";
import { useRibbon } from "./components/feedbackRibbon/RibbonProvider";

const Content = styled.div`
  margin-left: var(--rail-w);
  min-height: 100vh;

  @media (max-width: 900px) {
    margin-left: 0;
    min-height: calc(100vh - 56px);
  }
`;

export type Themes = "light" | "dark";

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token"),
  );
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const { showRibbon } = useRibbon();
  const { theme } = useTheme();

  async function getCurrentUser() {
    if (isLoggedIn) {
      try {
        const res = await api.get<User>("/users");
        const data = res.data;

        setCurrentUser(data);
      } catch (err: any) {
        const message = err.response?.data?.detail || "No user logged in.";
        showRibbon("error", message);

        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        setIsLoggedIn(false);
      }
    } else {
      setCurrentUser({
        id: 0,
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "",
      });
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, [isLoggedIn]);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const openLogin = () => setIsLoginOpen(true);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setIsLoginOpen={setIsLoginOpen}
        username={currentUser.username}
      />

      <Content>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                currentUser={currentUser}
                isLoggedIn={isLoggedIn}
                onLogin={openLogin}
              />
            }
          />
          <Route
            path="/workout"
            element={
              <ProtectedRoute onLogin={openLogin}>
                <Workout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises"
            element={
              <ProtectedRoute onLogin={openLogin}>
                <Exercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute onLogin={openLogin}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute onLogin={openLogin}>
                <Profile
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Content>
      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}
