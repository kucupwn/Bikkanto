import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useTheme } from "../ThemeProvider";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: var(--main-black);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    justify-content: left;
  }
`;

const NavList = styled.ul<{ $isOpen: boolean }>`
  list-style: none;
  display: flex;
  gap: 1rem;
  z-index: 999;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 110px;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: var(--main-black);
  }
`;

const Hamburger = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
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

  @media (max-width: 768px) {
    position: relative;
    right: 0;
  }
`;

const ThemeWrapper = styled.div`
  position: absolute;
  left: 1rem;

  @media (max-width: 768px) {
    position: relative;
    left: 0;
  }
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
      <Hamburger onClick={() => setIsMenuOpen((prev) => !prev)}>☰</Hamburger>
      <NavList $isOpen={isMenuOpen}>
        {links.map((link) => (
          <li key={link.path}>
            <StyledNavLink to={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </StyledNavLink>
          </li>
        ))}

        <ThemeWrapper>
          <button onClick={toggleTheme}>Theme</button>
        </ThemeWrapper>

        <AuthWrapper>
          {isLoggedIn ? (
            <LoginButton onClick={handleLogout}>Logout</LoginButton>
          ) : (
            <LoginButton onClick={() => setIsLoginOpen(true)}>
              Login
            </LoginButton>
          )}
        </AuthWrapper>
      </NavList>
    </Nav>
  );
}
