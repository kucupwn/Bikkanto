import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/nav/Navbar";
import { Home } from "./pages/Home";
import { Roll } from "./pages/Roll";
import { Exercises } from "./pages/Exercises";
import { History } from "./pages/History";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { useEffect, useState } from "react";
import { Profile } from "./pages/Profile";
import type { User } from "./types/userTypes";
import { api } from "./api/api";
import { useTheme } from "./components/ThemeProvider";

const TitleContainer = styled.div`
  width: 100vw;
  background-color: var(--dark-black);
  color: var(--main-white);
`;

const Title = styled.h1`
  font-size: 48px;
  font-family: "Times New Roman", Times, serif;
  justify-self: center;
  letter-spacing: 10px;
  margin: 0;
  padding-top: 10px;
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

  const { theme } = useTheme();

  async function getCurrentUser() {
    if (isLoggedIn) {
      try {
        const res = await api.get<User>("/users");
        const data = res.data;

        setCurrentUser(data);
      } catch (err) {
        console.error(err);
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

  return (
    <>
      <TitleContainer>
        <Title>BIKKANTO</Title>
      </TitleContainer>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setIsLoginOpen={setIsLoginOpen}
      />

      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route
          path="/roll"
          element={
            <ProtectedRoute>
              <Roll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}
