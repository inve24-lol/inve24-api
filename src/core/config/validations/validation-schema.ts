import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'local', 'prod').required(),

  SERVER_PORT: Joi.number().required(),
  SERVER_HOST: Joi.string().required(),
  SERVER_CLIENT_KAKAO_ADFIT: Joi.string().required(),
  SERVER_CLIENT_RIOT_SIGN_OUT_URL: Joi.string().required(),

  MYSQL_HOST: Joi.string().required(),
  MYSQL_USER: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_TCP_PORT: Joi.number().required(),
  MYSQL_TIME_ZONE: Joi.string().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),

  BCRYPT_PASSWORD_SALT: Joi.number().required(),
  BCRYPT_REFRESH_TOKEN_SALT: Joi.number().required(),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_EMAIL_CERT_CODE_TTL: Joi.number().required(),
  REDIS_EMAIL_CERT_CODE_DB: Joi.number().required(),
  REDIS_REFRESH_TOKEN_TTL: Joi.number().required(),
  REDIS_REFRESH_TOKEN_DB: Joi.number().required(),
  REDIS_SUMMONER_TTL: Joi.number().required(),
  REDIS_SUMMONER_DB: Joi.number().required(),
  REDIS_SOCKET_CLIENT_TTL: Joi.number().required(),
  REDIS_SOCKET_CLIENT_DB: Joi.number().required(),

  RIOT_RSO_AUTH_HOST: Joi.string().required(),
  RIOT_RSO_AUTH_AUTHORIZE: Joi.string().required(),
  RIOT_RSO_AUTH_TOKEN: Joi.string().required(),
  RIOT_RSO_OAUTH_CLIENT_ID: Joi.string().required(),
  RIOT_RSO_OAUTH_CLIENT_SECRET: Joi.string().required(),
  RIOT_RSO_OAUTH_RESPONSE_TYPE: Joi.string().required(),
  RIOT_RSO_OAUTH_SCOPE: Joi.string().required(),
  RIOT_RSO_OAUTH_GRANT_TYPE: Joi.string().required(),
  RIOT_RSO_OAUTH_REDIRECT_URI: Joi.string().required(),
  RIOT_API_ASIA_HOST: Joi.string().required(),
  RIOT_API_ASIA_ACCOUNT_V1_ME: Joi.string().required(),
  RIOT_API_KR_HOST: Joi.string().required(),
  RIOT_API_KR_SUMMONER_V4_ME: Joi.string().required(),
  RIOT_API_KR_LEAGUE_V4_SUMMONER_ID: Joi.string().required(),
  RIOT_API_APP_KEY: Joi.string().required(),
});
