import { useState } from "react";
import styled from "styled-components";
import { api } from "../../api/api";
import { ModalBase } from "../ModalBase";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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
  const { showRibbon } = useRibbon();

  function handleChangeSubmit() {
    if (newPassword !== verifyNewPassword) {
      showRibbon("error", "New passwords are not matching.");
      return;
    }

    const passwords = {
      password: currentPassword,
      new_password: newPassword,
    };

    try {
      api.patch("/users/change_password", passwords);
      showRibbon("success", "Password changed successfully.");
    } catch (err) {
      showRibbon("error", "Could not change password.");
    }

    onClose();
  }

  return (
    <ModalBase onClose={onClose}>
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
    </ModalBase>
  );
}
