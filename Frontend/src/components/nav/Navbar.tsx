import styled from "styled-components";
import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import { useTheme } from "../ThemeProvider";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: var(--main-black);
  margin-bottom: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
`;

const StyledNavLink = styled(NavLink)`
  color: var(--main-white);
  font-size: 24px;
  text-decoration: none;

  &.active {
    font-weight: bold;
    border-bottom: 2px solid var(--main-white);
  }
`;

const AuthWrapper = styled.div`
  position: absolute;
  right: 1rem;
`;

const ThemeWrapper = styled.div`
  position: absolute;
  left: 1rem;
`;

const LoginButton = styled.button`
  font-size: 16px;
`;

const links = [
  { name: "Home", path: "/" },
  { name: "Roll", path: "/roll" },
  { name: "Exercises", path: "/exercises" },
  { name: "History", path: "/history" },
  { name: "Profile", path: "/profile" },
];

interface Props {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
}

export function Navbar({ isLoggedIn, setIsLoggedIn, setIsLoginOpen }: Props) {
  const { theme, setTheme } = useTheme();

  function handleLogout() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
  }

  function toggleTheme() {
    const targetTheme = theme === "light" ? "dark" : "light";

    setTheme(targetTheme);
    localStorage.setItem("theme", targetTheme);
  }

  return (
    <Nav>
      <ThemeWrapper>
        <button onClick={toggleTheme}>Theme</button>
      </ThemeWrapper>
      <NavList>
        {links.map((link) => (
          <li key={link.path}>
            <StyledNavLink to={link.path}>{link.name}</StyledNavLink>
          </li>
        ))}
      </NavList>
      <AuthWrapper>
        {isLoggedIn ? (
          <LoginButton onClick={handleLogout}>Logout</LoginButton>
        ) : (
          <LoginButton onClick={() => setIsLoginOpen(true)}>Login</LoginButton>
        )}
      </AuthWrapper>
    </Nav>
  );
}
