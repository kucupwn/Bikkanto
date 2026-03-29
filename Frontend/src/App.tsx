import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Roll } from "./pages/Roll";
import { Exercises } from "./pages/Exercises";
import { History } from "./pages/History";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./pages/ProtectedRoute";

const Title = styled.h1`
  font-size: 48px;
  justify-self: center;
  margin: 0;
`;

export function App() {
  return (
    <>
      <Title>Bikkanto</Title>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
