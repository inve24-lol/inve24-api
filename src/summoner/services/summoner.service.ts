import redisConfig from '@config/settings/redis.config';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ISummonerCacheRepository } from '@redis/abstracts/summoner-cache-repository.abstract';
import { ISummonerRepository } from '@type-orm/abstracts/summoner-repository.abstract';
import { HttpService } from '@http/services/http.service';
import { RegisterRequestDto } from '@summoner/dto/requests/register-request.dto';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { CreateSummonerDto } from '@summoner/dto/internals/create-summoner.dto';
import { SummonerProfileDto } from '@summoner/dto/internals/summoner-profile.dto';
import { RegisterSummonerResponseDto } from '@summoner/dto/responses/register-summoner-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SummonerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly summonerCacheRepository: ISummonerCacheRepository,
    private readonly summonerRepository: ISummonerRepository,
    @Inject(redisConfig.KEY) private readonly config: ConfigType<typeof redisConfig>,
  ) {}

  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    const riotSignOnUrl = this.httpService.generateRiotSignOnUrl();

    return plainToInstance(RiotSignOnUrlResponseDto, { riotSignOnUrl });
  }

  async registerSummoner(
    uuid: string,
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterSummonerResponseDto> {
    const { rsoAccessCode } = registerRequest;

    await this.createSummoner(uuid, rsoAccessCode);

    const summonerProfiles = await this.findSummonerProfilesByUuid(uuid);

    await this.cacheSummonerProfiles(uuid, summonerProfiles);

    return plainToInstance(RegisterSummonerResponseDto, { summonerProfiles });
  }

  private async cacheSummonerProfiles(
    uuid: string,
    summonerProfiles: SummonerProfileDto[],
  ): Promise<void> {
    const summoners = JSON.stringify({ summonerProfiles });

    this.summonerCacheRepository.setSummoner(uuid, summoners, this.config.redis.summoner.ttl);
  }

  private async createSummoner(uuid: string, rsoAccessCode: string): Promise<void> {
    const { riotAccountInfo, riotSummonerInfo, riotLeagueInfo } =
      await this.httpService.generateSummonerLeagueAccount(rsoAccessCode);

    await this.checkSummonerExists(riotAccountInfo.puuid);

    await this.checkSummonerCreationLimit(uuid);

    const createSummoner = plainToInstance(CreateSummonerDto, {
      uuid,
      ...riotAccountInfo,
      ...riotSummonerInfo,
      ...riotLeagueInfo,
    });

    await this.summonerRepository.saveSummoner(createSummoner);
  }

  private async checkSummonerExists(puuid: string): Promise<void> {
    const summoner = await this.summonerRepository.findSummonerByPuuid(puuid);

    if (summoner) throw new ConflictException('해당 라이엇 계정으로 등록된 소환사가 존재합니다.');
  }

  private async checkSummonerCreationLimit(uuid: string): Promise<void> {
    const count = await this.summonerRepository.findSummonerCountByUserUuid(uuid);

    if (count >= 5) throw new ConflictException('등록 가능한 소환사 수를 초과하였습니다.');
  }

  private async findSummonerProfilesByUuid(uuid: string): Promise<SummonerProfileDto[]> {
    const summoners = await this.summonerRepository.findSummonersByUserUuid(uuid);

    return plainToInstance(SummonerProfileDto, summoners);
  }
}
