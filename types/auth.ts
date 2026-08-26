export interface AuthUser {
  id: number | null;
  email: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string | null;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  gender: "Male" | "Female";
  email: string;
  password: string;
  date_of_birth?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}