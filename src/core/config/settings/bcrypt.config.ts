import { registerAs } from '@nestjs/config';
import { BCRYPT_CONFIG_TOKEN } from '@config/constants/config.token';

export default registerAs(BCRYPT_CONFIG_TOKEN, () => ({
  bcrypt: {
    passwordSalt: +process.env.BCRYPT_PASSWORD_SALT!,
    refreshTokenSalt: +process.env.BCRYPT_REFRESH_TOKEN_SALT!,
  },
}));
