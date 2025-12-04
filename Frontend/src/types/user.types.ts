export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export type UserCallbacks = {
  onLogin: (username: string, password: string) => Promise<void> | void;
  onRegister: (form: HTMLFormElement) => Promise<void> | void;
  onOpenEdit: (editKey: string, label: string, sourceId: string) => void;
  onOpenPasswordChange: () => void;
};
