import { useState, type FormEvent } from "react";
import styled from "styled-components";
import { api } from "../../api/api";
import { ModalBase } from "../ModalBase";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { Button, Field, FieldLabel, Input } from "../ui";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export function PasswordChangeModal(props: Props) {
  if (!props.isOpen) return null;
  return <PasswordChangeContent {...props} />;
}

function PasswordChangeContent({ onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [verifyNewPassword, setVerifyNewPassword] = useState<string>("");
  const { showRibbon } = useRibbon();

  async function handleChangeSubmit(e: FormEvent) {
    e.preventDefault();

    if (newPassword !== verifyNewPassword) {
      showRibbon("error", "New passwords are not matching.");
      return;
    }

    const passwords = {
      password: currentPassword,
      new_password: newPassword,
    };

    try {
      await api.patch("/users/change_password", passwords);

      showRibbon("success", "Password changed successfully.");
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Could not change password.";
      showRibbon("error", message);
    }
  }

  return (
    <ModalBase onClose={onClose} title="Change password" width="420px">
      <Form onSubmit={handleChangeSubmit}>
        <Field>
          <FieldLabel>Current password</FieldLabel>
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel>New password</FieldLabel>
          <Input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel>Repeat new password</FieldLabel>
          <Input
            type="password"
            autoComplete="new-password"
            value={verifyNewPassword}
            onChange={(e) => setVerifyNewPassword(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" $variant="primary" $block>
          Change password
        </Button>
      </Form>
    </ModalBase>
  );
}
