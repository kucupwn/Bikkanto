import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Roll } from "./pages/Roll";
import { Exercises } from "./pages/Exercises";
import { History } from "./pages/History";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { useState } from "react";
import { Profile } from "./pages/Profile";
import type { User } from "./types/userTypes";

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

  return (
    <>
      <Title>Bikkanto</Title>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setIsLoginOpen={setIsLoginOpen}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
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
              <Profile currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}
