import { registerAs } from '@nestjs/config';
import { JWT_CONFIG_TOKEN } from '@core/config/constants/config.token';

export default registerAs(JWT_CONFIG_TOKEN, () => ({
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
  },
}));
