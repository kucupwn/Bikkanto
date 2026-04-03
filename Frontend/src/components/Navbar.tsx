import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #aaa;
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
  color: #000;
  font-size: 24px;
  text-decoration: none;

  &.active {
    font-weight: bold;
    border-bottom: 2px solid black;
  }
`;

const AuthWrapper = styled.div`
  position: absolute;
  right: 1rem;
`;

const links = [
  { name: "Home", path: "/" },
  { name: "Roll", path: "/roll" },
  { name: "Exercises", path: "/exercises" },
  { name: "History", path: "/history" },
];

export function Navbar() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <StyledNavLink to={"/login"}>
              <button>Login</button>
            </StyledNavLink>
          )}
        </AuthWrapper>
      </Nav>
    </>
  );
}
