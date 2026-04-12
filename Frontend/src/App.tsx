import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
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

const Title = styled.h1`
  font-size: 48px;
  justify-self: center;
  margin: 0;
`;

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

  return (
    <>
      <Title>Bikkanto</Title>
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
