import { registerAs } from '@nestjs/config';
import { RIOT_CONFIG_TOKEN } from '@core/config/constants/config.token';

export default registerAs(RIOT_CONFIG_TOKEN, () => ({
  riot: {
    rso: {
      auth: {
        host: process.env.RIOT_RSO_AUTH_HOST,
        authorize: process.env.RIOT_RSO_AUTH_AUTHORIZE,
        token: process.env.RIOT_RSO_AUTH_TOKEN,
        clientId: process.env.RIOT_RSO_AUTH_CLIENT_ID,
        clientSecret: process.env.RIOT_RSO_AUTH_CLIENT_SECRET,
        responseType: process.env.RIOT_RSO_AUTH_RESPONSE_TYPE,
        scope: process.env.RIOT_RSO_AUTH_SCOPE,
      },
      redirectUri: process.env.RIOT_RSO_REDIRECT_URI,
    },
    api: {
      asia: {
        host: process.env.RIOT_ASIA_HOST,
        account: { v1: { me: process.env.RIOT_API_ASIA_ACCOUNT_V1_ME } },
      },
      kr: {
        host: process.env.RIOT_KR_HOST,
        summoner: { v1: { me: process.env.RIOT_API_KR_SUMMONER_V4_ME } },
        league: { v4: { summonerId: process.env.RIOT_API_KR_LEAGUE_V4_SUMMONER_ID } },
      },
      appKey: process.env.RIOT_API_APP_KEY,
    },
  },
}));
