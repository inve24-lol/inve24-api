import redisConfig from '@config/settings/redis.config';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ISummonerCacheRepository } from '@redis/abstracts/summoner-cache-repository.abstract';
import { ISummonerRepository } from '@type-orm/abstracts/summoner-repository.abstract';
import { HttpService } from '@http/services/http.service';
import { RegisterSummonerRequestDto } from '@summoner/dto/requests/register-summoner-request.dto';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { CreateSummonerDto } from '@summoner/dto/internals/create-summoner.dto';
import { SummonerProfileDto } from '@summoner/dto/internals/summoner-profile.dto';
import { FindSummonersResponseDto } from '@summoner/dto/responses/find-summoners-response.dto';
import { plainToInstance } from 'class-transformer';
import { FindSummonerRequestDto } from '@summoner/dto/requests/find-summoner-request.dto';
import { FindSummonerResponseDto } from '@summoner/dto/responses/find-summoner-response.dto';
import { RemoveSummonerRequestDto } from '@summoner/dto/requests/remove-summoner-request.dto';
import { UsersService } from '@users/services/users.service';
import { Role } from '@common/constants/roles.enum';

@Injectable()
export class SummonerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
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
    registerSummonerRequest: RegisterSummonerRequestDto,
  ): Promise<FindSummonersResponseDto> {
    const { rsoAccessCode } = registerSummonerRequest;

    await this.createSummoner(uuid, rsoAccessCode);

    const summonerCount = await this.summonerRepository.findSummonerCountByUserUuid(uuid);

    if (summonerCount === 1) await this.usersService.updateUserRole(uuid, Role.MEMBER);

    const summonerProfiles = await this.findSummonerProfilesByUuid(uuid);

    await this.setSummonerData('uuid', uuid, summonerProfiles);

    return plainToInstance(FindSummonersResponseDto, { summonerProfiles });
  }

  async findSummoners(uuid: string): Promise<FindSummonersResponseDto> {
    const cachedSummonerProfiles = await this.getSummonerData('uuid', uuid);

    if (cachedSummonerProfiles)
      return plainToInstance(FindSummonersResponseDto, {
        summonerProfiles: cachedSummonerProfiles,
      });

    const summonerProfiles = await this.findSummonerProfilesByUuid(uuid);

    await this.setSummonerData('uuid', uuid, summonerProfiles);

    return plainToInstance(FindSummonersResponseDto, { summonerProfiles });
  }

  async findSummoner(
    findSummonerRequest: FindSummonerRequestDto,
  ): Promise<FindSummonerResponseDto> {
    const { summonerId } = findSummonerRequest;

    const summonerProfile = await this.findSummonerProfileById(parseInt(summonerId));

    return plainToInstance(FindSummonerResponseDto, { summonerProfile });
  }

  async removeSummoner(uuid: string, removeSummonerRequest: RemoveSummonerRequestDto) {
    const { summonerId } = removeSummonerRequest;

    const cachedSummonerProfiles = await this.getSummonerData('uuid', uuid);

    if (cachedSummonerProfiles) await this.delSummonerData('uuid', uuid);

    await this.summonerRepository.deleteSummoner(parseInt(summonerId));

    const summonerCount = await this.summonerRepository.findSummonerCountByUserUuid(uuid);

    if (summonerCount === 0) await this.usersService.updateUserRole(uuid, Role.GUEST);
  }

  private async getSummonerData(
    keyId: string,
    keyValue: string,
  ): Promise<SummonerProfileDto[] | void> {
    const cachedData = await this.summonerCacheRepository.getSummoner(`${keyId}:${keyValue}`);

    if (cachedData) return JSON.parse(cachedData);
  }

  private async setSummonerData(
    keyId: string,
    keyValue: string,
    summonerData: SummonerProfileDto[],
  ): Promise<void> {
    await this.summonerCacheRepository.setSummoner(
      `${keyId}:${keyValue}`,
      JSON.stringify(summonerData),
      this.config.redis.summoner.ttl,
    );
  }

  private async delSummonerData(keyId: string, keyValue: string): Promise<void> {
    await this.summonerCacheRepository.delSummoner(`${keyId}:${keyValue}`);
  }

  async findSummonerProfileByPuuid(puuid: string): Promise<SummonerProfileDto | null> {
    const summoner = await this.summonerRepository.findSummonerByPuuid(puuid);

    return plainToInstance(SummonerProfileDto, summoner);
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

    if (summoner) throw new ConflictException('이미 등록된 소환사 계정입니다.');
  }

  private async checkSummonerCreationLimit(uuid: string): Promise<void> {
    const count = await this.summonerRepository.findSummonerCountByUserUuid(uuid);

    if (count >= 5) throw new ConflictException('등록 가능한 소환사 수를 초과하였습니다.');
  }

  private async findSummonerProfileById(id: number): Promise<SummonerProfileDto> {
    const summoners = await this.summonerRepository.findSummonerById(id);

    if (!summoners) throw new NotFoundException('해당 계정으로 등록된 소환사가 존재하지 않습니다.');

    return plainToInstance(SummonerProfileDto, summoners);
  }

  private async findSummonerProfilesByUuid(uuid: string): Promise<SummonerProfileDto[]> {
    const summoners = await this.summonerRepository.findSummonersByUserUuid(uuid);

    if (!summoners.length)
      throw new NotFoundException('해당 계정으로 등록된 소환사가 존재하지 않습니다.');

    return plainToInstance(SummonerProfileDto, summoners);
  }
}
