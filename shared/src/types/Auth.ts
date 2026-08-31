// Matches docs/05_Message_Contracts.md — Contract 7 (Administrator Login)

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number; // seconds
}
