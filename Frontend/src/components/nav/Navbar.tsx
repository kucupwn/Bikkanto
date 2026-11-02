import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { type Dispatch, type SetStateAction } from "react";
import {
  Dumbbell,
  History,
  House,
  LogIn,
  LogOut,
  Moon,
  Shuffle,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

/* Desktop: steel side rail. Phone: slim top bar + bottom tab bar. */

const Rail = styled.aside`
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--rail-w);
  display: flex;
  flex-direction: column;
  background: #1d1f23;
  border-right: 1px solid #000;
  color: var(--board-ink);
  z-index: 50;

  @media (max-width: 900px) {
    position: sticky;
    inset: 0 0 auto 0;
    width: 100%;
    height: 56px;
    flex-direction: row;
    align-items: center;
    border-right: 0;
    border-bottom: 1px solid #000;
  }
`;

const Wordmark = styled(Link)`
  display: block;
  padding: 1.75rem 1.5rem 1.5rem;
  font-family: var(--font-board);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: var(--board-ink);
  text-decoration: none;
  border-bottom: 1px solid #2a2d31;

  @media (max-width: 900px) {
    padding: 0 1rem;
    font-size: 20px;
    border-bottom: 0;
    margin-right: auto;
  }
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 900px) {
    position: fixed;
    inset: auto 0 0 0;
    height: var(--tabbar-h);
    padding: 0 0.25rem env(safe-area-inset-bottom);
    flex-direction: row;
    justify-content: space-around;
    background: #1d1f23;
    border-top: 1px solid #000;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-height: 44px;
  padding: 0 0.875rem;
  border-radius: var(--radius);
  font-family: var(--font-board);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--board-ink-2);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: var(--board-ink);
    background: #26292d;
  }

  &.active {
    color: var(--amber);
    background: var(--board);
  }

  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-width: 60px;
    padding: 6px 4px;
    font-size: 11px;
    letter-spacing: 0.1em;

    &.active {
      background: transparent;
    }
  }
`;

const RailFoot = styled.div`
  margin-top: auto;
  padding: 1rem 0.75rem 1.25rem;
  border-top: 1px solid #2a2d31;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 900px) {
    margin: 0;
    padding: 0 0.5rem;
    border: 0;
    flex-direction: row;
    align-items: center;
  }
`;

const Signed = styled.div`
  padding: 0 0.875rem 0.25rem;
  font-family: var(--font-board);
  font-size: 13px;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--board-ink-2);

  strong {
    display: block;
    font-size: 16px;
    color: var(--board-ink);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const FootButton = styled.button<{ $accent?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-height: 40px;
  padding: 0 0.875rem;
  border: 1px solid ${({ $accent }) => ($accent ? "var(--amber)" : "#2f3237")};
  border-radius: var(--radius);
  background: ${({ $accent }) => ($accent ? "var(--amber)" : "transparent")};
  color: ${({ $accent }) => ($accent ? "var(--amber-ink)" : "var(--board-ink-2)")};
  font-family: var(--font-board);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: var(--track);
  text-transform: uppercase;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: ${({ $accent }) => ($accent ? "var(--amber-ink)" : "var(--board-ink)")};
    background: ${({ $accent }) => ($accent ? "var(--amber-hover)" : "#26292d")};
  }

  @media (max-width: 900px) {
    min-height: 36px;
    padding: 0 0.625rem;
    gap: 0.5rem;

    span {
      display: ${({ $accent }) => ($accent ? "inline" : "none")};
    }
  }
`;

const links: { name: string; path: string; icon: LucideIcon }[] = [
  { name: "Home", path: "/", icon: House },
  { name: "Exercises", path: "/exercises", icon: Dumbbell },
  { name: "Workout", path: "/workout", icon: Shuffle },
  { name: "History", path: "/history", icon: History },
  { name: "Profile", path: "/profile", icon: UserRound },
];

interface Props {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
  username: string;
}

export function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  setIsLoginOpen,
  username,
}: Props) {
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
    <Rail>
      <Wordmark to="/" aria-label="Bikkanto home">
        BIKKANTO
      </Wordmark>
      <nav aria-label="Main">
        <NavList>
          {links.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <NavItem to={path} end={path === "/"}>
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                {name}
              </NavItem>
            </li>
          ))}
        </NavList>
      </nav>

      <RailFoot>
        {isLoggedIn && username && (
          <Signed>
            Signed in
            <strong>{username}</strong>
          </Signed>
        )}
        <FootButton
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          {theme === "light" ? (
            <Moon size={18} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Sun size={18} strokeWidth={1.75} aria-hidden="true" />
          )}
          <span>{theme === "light" ? "Dark" : "Light"}</span>
        </FootButton>
        {isLoggedIn ? (
          <FootButton onClick={handleLogout} aria-label="Log out">
            <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Log out</span>
          </FootButton>
        ) : (
          <FootButton $accent onClick={() => setIsLoginOpen(true)}>
            <LogIn size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Log in</span>
          </FootButton>
        )}
      </RailFoot>
    </Rail>
  );
}
