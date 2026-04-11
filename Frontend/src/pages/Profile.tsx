import styled from "styled-components";
import type { User } from "../types/userTypes";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { api } from "../api/api";
import { PasswordChangeModal } from "../components/profile/PasswordChangeModal";

interface Props {
  currentUser: User;
  setCurrentUser: Dispatch<SetStateAction<User>>;
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 1rem;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
`;

export function Profile({ currentUser, setCurrentUser }: Props) {
  const [email, setEmail] = useState<string>(currentUser.email);
  const [firstName, setFirstName] = useState<string>(currentUser.first_name);
  const [lastName, setLastName] = useState<string>(currentUser.last_name);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] =
    useState<boolean>(false);

  async function submitChange(data: Record<string, string>) {
    try {
      const res = await api.patch("/users", data);
      setCurrentUser(res.data);
    } catch (err) {
      console.error(err);
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

  return (
    <>
      <ProfileContainer>
        <InputSection>
          <span>Email</span>
          <InputWrapper>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={currentUser.email}
            />
            <button onClick={() => handleChangeApply("email", email)}>
              Apply
            </button>
          </InputWrapper>
        </InputSection>
        <InputSection>
          <span>First name</span>
          <InputWrapper>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={currentUser.first_name}
            />
            <button onClick={() => handleChangeApply("first_name", firstName)}>
              Apply
            </button>
          </InputWrapper>
        </InputSection>
        <InputSection>
          <span>Last name</span>
          <InputWrapper>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={currentUser.last_name}
            />
            <button onClick={() => handleChangeApply("last_name", lastName)}>
              Apply
            </button>
          </InputWrapper>
        </InputSection>
        <InputSection>
          <span>Password</span>
          <button onClick={() => setIsPasswordChangeOpen(true)}>Change</button>
        </InputSection>
      </ProfileContainer>
      <PasswordChangeModal
        isOpen={isPasswordChangeOpen}
        onClose={() => setIsPasswordChangeOpen(false)}
      />
    </>
  );
}
