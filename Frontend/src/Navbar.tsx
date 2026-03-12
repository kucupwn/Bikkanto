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

const links = [
  { name: "Home", path: "/" },
  { name: "Roll", path: "/roll" },
  { name: "Exercises", path: "/exercises" },
  { name: "History", path: "/history" },
];
export function Navbar() {
  return (
    <>
      <Nav>
        <NavList>
          {links.map((link) => (
            <li key={link.path}>
              <NavLink href={link.path}>{link.name}</NavLink>
            </li>
          ))}
        </NavList>
      </Nav>
    </>
  );
}
