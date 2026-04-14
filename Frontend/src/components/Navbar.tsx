import styled from "styled-components";
import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #242424;
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
  color: #cecece;
  font-size: 24px;
  text-decoration: none;

  &.active {
    font-weight: bold;
    border-bottom: 2px solid #cecece;
  }
`;

const AuthWrapper = styled.div`
  position: absolute;
  right: 1rem;
`;

const LoginButton = styled.button`
  padding: 5px;
  font-size: 16px;
`;

const links = [
  { name: "Home", path: "/" },
  { name: "Roll", path: "/roll" },
  { name: "Exercises", path: "/exercises" },
  { name: "History", path: "/history" },
  { name: "Profile", path: "/profile" },
];

export function Navbar({ isLoggedIn, setIsLoggedIn, setIsLoginOpen }: Props) {
  function handleLogout() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
  }

  return (
    <>
      <Nav>
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
            <LoginButton onClick={() => setIsLoginOpen(true)}>
              Login
            </LoginButton>
          )}
        </AuthWrapper>
      </Nav>
    </>
  );
}
