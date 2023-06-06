interface RLogin {
  username: string;
  password: string;
}

interface RRegister {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

interface RResetPassword {
  email: string;
  password: string;
  password_confirmation: string;
}

interface RResetToken {
  email: string;
}

interface MJwt {
  access_token: string;
  token_type: string;
  expires_in: 3600;
}

interface IProfile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  joined_at?: string;
  created_at: string;
  updated_at: string;
}

export type { RLogin, RRegister, MJwt, RResetToken, RResetPassword, IProfile };
