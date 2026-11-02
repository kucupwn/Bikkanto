import styled from "styled-components";
import { KeyRound } from "lucide-react";
import type { User } from "../types/userTypes";
import {
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { api } from "../api/api";
import { PasswordChangeModal } from "../components/profile/PasswordChangeModal";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import {
  Button,
  FieldLabel,
  Input,
  Page,
  PageHeader,
  PageLede,
  PageTitle,
  Panel,
  SectionTitle,
} from "../components/ui";

interface Props {
  currentUser: User;
  setCurrentUser: Dispatch<SetStateAction<User>>;
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 640px;
`;

const Row = styled.form`
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--line-soft);

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr) auto;

    > :first-child {
      grid-column: 1 / -1;
    }
  }
`;

const PasswordRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  p {
    color: var(--ink-2);
  }
`;

export function Profile({ currentUser, setCurrentUser }: Props) {
  const [email, setEmail] = useState<string>(currentUser.email);
  const [firstName, setFirstName] = useState<string>(currentUser.first_name);
  const [lastName, setLastName] = useState<string>(currentUser.last_name);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] =
    useState<boolean>(false);
  const { showRibbon } = useRibbon();

  async function submitChange(data: Record<string, string>) {
    try {
      const res = await api.patch("/users", data);
      setCurrentUser(res.data);
      showRibbon("success", "Successful user data update.");
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Could not update user data.";
      showRibbon("error", message);
    }
  }

  function handleChangeApply(field: string, value: string) {
    submitChange({ [field]: value });
  }

  useEffect(() => {
    setEmail(currentUser.email);
    setFirstName(currentUser.first_name);
    setLastName(currentUser.last_name);
  }, [currentUser]);

  const fields = [
    {
      key: "email",
      label: "Email",
      type: "email",
      autoComplete: "email",
      value: email,
      set: setEmail,
      saved: currentUser.email,
    },
    {
      key: "first_name",
      label: "First name",
      type: "text",
      autoComplete: "given-name",
      value: firstName,
      set: setFirstName,
      saved: currentUser.first_name,
    },
    {
      key: "last_name",
      label: "Last name",
      type: "text",
      autoComplete: "family-name",
      value: lastName,
      set: setLastName,
      saved: currentUser.last_name,
    },
  ];

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Profile</PageTitle>
          <PageLede>
            Signed in as <strong>{currentUser.username}</strong>. Each field
            saves on its own.
          </PageLede>
        </div>
      </PageHeader>

      <Stack>
        <Panel aria-labelledby="details-title">
          <SectionTitle id="details-title">Details</SectionTitle>
          {fields.map((field) => {
            const inputId = `profile-${field.key}`;
            const unchanged = field.value === field.saved;

            return (
              <Row
                key={field.key}
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  handleChangeApply(field.key, field.value);
                }}
              >
                <label htmlFor={inputId}>
                  <FieldLabel>{field.label}</FieldLabel>
                </label>
                <Input
                  id={inputId}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                />
                <Button type="submit" disabled={unchanged}>
                  Save
                </Button>
              </Row>
            );
          })}
        </Panel>

        <Panel aria-labelledby="password-title">
          <SectionTitle id="password-title">Password</SectionTitle>
          <PasswordRow>
            <p>Change the password you log in with.</p>
            <Button onClick={() => setIsPasswordChangeOpen(true)}>
              <KeyRound size={16} aria-hidden="true" />
              Change password
            </Button>
          </PasswordRow>
        </Panel>
      </Stack>

      <PasswordChangeModal
        isOpen={isPasswordChangeOpen}
        onClose={() => setIsPasswordChangeOpen(false)}
      />
    </Page>
  );
}
