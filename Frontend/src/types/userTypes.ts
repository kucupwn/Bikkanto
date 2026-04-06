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
