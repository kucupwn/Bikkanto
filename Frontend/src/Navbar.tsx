import styled from "styled-components";

const Title = styled.h1`
  font-size: 48px;
  justify-self: center;
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #aaa;
`;

const NavbarLinks = styled.ul`
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const NavbarLink = styled.li`
  font-size: 24px;
  margin-right: 1rem;
  cursor: pointer;
`;

export function Navbar() {
  return (
    <>
      <Title>Bikkanto</Title>
      <Nav>
        <NavbarLinks>
          <NavbarLink>Home</NavbarLink>
          <NavbarLink>Roll</NavbarLink>
          <NavbarLink>Exercises</NavbarLink>
          <NavbarLink>History</NavbarLink>
        </NavbarLinks>
      </Nav>
    </>
  );
}
