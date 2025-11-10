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
