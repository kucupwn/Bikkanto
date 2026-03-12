import styled from "styled-components";
import { Navbar } from "./Navbar";

const Title = styled.h1`
  font-size: 48px;
  justify-self: center;
  margin: 0;
`;

export function App() {
  return (
    <>
      <Title>Bikkanto</Title>
      <Navbar></Navbar>;
    </>
  );
}
