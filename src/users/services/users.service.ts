import bcryptConfig from '@core/config/bcrypt.config';
import { IUserRepository } from '@core/type-orm/abstracts/user-repository.abstract';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '@users/dto/internals/create-user.dto';
import { SignUpRequestDto } from '@users/dto/requests/sign-up-request.dto';
import { SignUpResponseDto } from '@users/dto/responses/sign-up-response.dto';
import { UserProfileDto } from '@users/dto/internals/user-profile.dto';
import bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: IUserRepository,
    @Inject(bcryptConfig.KEY) private readonly config: ConfigType<typeof bcryptConfig>,
  ) {}

  async signUpUser(signUpRequest: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { email, nickname } = signUpRequest;

    await this.checkUserEmailExists(email);

    await this.checkUserNicknameExists(nickname);

    const userProfile: UserProfileDto = await this.createUser(signUpRequest);

    return plainToInstance(SignUpResponseDto, { userProfile });
  }

  async verifyUser(email: string, password: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) throw new NotFoundException('해당 이메일로 생성된 계정이 존재하지 않습니다.');

    const { password: hashedPassword } = user;

    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatched) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return plainToInstance(UserProfileDto, user);
  }

  async getUserProfileByUuid(uuid: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findUserByUuid(uuid);

    if (!user) throw new NotFoundException('계정이 존재하지 않습니다.');

    return plainToInstance(UserProfileDto, user);
  }

  async checkUserEmailExists(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);

    if (user) throw new ConflictException('해당 이메일로 생성된 계정이 이미 존재합니다.');
  }

  private async checkUserNicknameExists(nickname: string): Promise<void> {
    const user = await this.userRepository.findUserByNickname(nickname);

    if (user) throw new ConflictException('해당 닉네임으로 생성된 계정이 이미 존재합니다.');
  }

  private async createUser(signUpRequest: SignUpRequestDto): Promise<UserProfileDto> {
    const { password } = signUpRequest;

    const hashedPassword = await bcrypt.hash(password, this.config.bcrypt.passwordSalt);

    const createUser: CreateUserDto = plainToInstance(CreateUserDto, {
      ...signUpRequest,
      password: hashedPassword,
    });

    const user = await this.userRepository.saveUser(createUser);

    return plainToInstance(UserProfileDto, user);
  }
}
