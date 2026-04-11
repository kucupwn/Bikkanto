import { useState } from "react";
import styled from "styled-components";
import { api } from "../../api/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  min-width: 300px;
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export function PasswordChangeModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [verifyNewPassword, setVerifyNewPassword] = useState<string>("");

  function handleChangeSubmit() {
    if (newPassword !== verifyNewPassword) {
      console.error("New passwords not matching.");
      return;
    }

    const passwords = {
      password: currentPassword,
      new_password: newPassword,
    };

    try {
      api.patch("/users/change_password", passwords);
    } catch (err) {
      console.error(err);
    }

    onClose();
  }

  return (
    <>
      <Overlay onClick={onClose}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <InputsContainer>
            <h2>Password change</h2>
            <InputWrapper>
              <span>Old password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <span>New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <span>Verify new password</span>
              <input
                type="password"
                value={verifyNewPassword}
                onChange={(e) => setVerifyNewPassword(e.target.value)}
              />
            </InputWrapper>
            <button onClick={handleChangeSubmit}>Submit</button>
          </InputsContainer>
        </ModalBox>
      </Overlay>
    </>
  );
}
