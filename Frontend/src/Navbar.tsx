import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #aaa;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
`;

const NavLink = styled.a`
  color: #000;
  font-size: 24px;
  text-decoration: none;
`;

export function Navbar() {
  return (
    <>
      <Nav>
        <NavList>
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          <li>
            <NavLink href="/roll">Roll</NavLink>
          </li>
          <li>
            <NavLink href="/exercises">Exercises</NavLink>
          </li>
          <li>
            <NavLink href="/history">History</NavLink>
          </li>
        </NavList>
      </Nav>
    </>
  );
}
