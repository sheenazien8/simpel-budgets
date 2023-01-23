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

interface RResetToken {
  email: string;
}

interface MJwt {
  access_token: string;
  token_type: string;
  expires_in: 3600;
}

export { RLogin, RRegister, MJwt, RResetToken };
