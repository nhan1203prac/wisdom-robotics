export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}