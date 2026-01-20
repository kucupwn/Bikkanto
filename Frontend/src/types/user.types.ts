export interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface UserCreate extends User {
  password?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const UserDataChange = {
  UserData: "userdata",
  Password: "password",
} as const;
export type UserDataChange =
  (typeof UserDataChange)[keyof typeof UserDataChange];

export type UserCallbacks = {
  onLogin: (username: string, password: string) => Promise<void> | void;
  onRegister: (form: HTMLFormElement) => Promise<void> | void;
  onOpenEdit: (editKey: string, label: string, sourceId: string) => void;
  onOpenPasswordChange: () => void;
};
