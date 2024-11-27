import bcryptConfig from '@core/config/bcrypt.config';
import { IUserRepository } from '@core/type-orm/abstracts/user-repository.abstract';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '@users/dtos/internals/create-user.dto';
import { SignUpRequestDto } from '@users/dtos/requests/sign-up-request.dto';
import { SignUpResponseDto } from '@users/dtos/responses/sign-up-response.dto';
import { UserProfileDto } from '@users/dtos/internals/user-profile.dto';
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

    if (!user) throw new NotFoundException('Account does not exist.');

    const { password: hashedPassword } = user;

    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatched) throw new UnauthorizedException('The password is incorrect.');

    return plainToInstance(UserProfileDto, user);
  }

  async getUserProfileByUuid(uuid: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findUserByUuid(uuid);

    if (!user) throw new NotFoundException('The user has already been deleted.');

    return plainToInstance(UserProfileDto, user);
  }

  async checkUserEmailExists(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);

    if (user) throw new BadRequestException('이메일이 이미 존재합니다.');
  }

  private async checkUserNicknameExists(nickname: string): Promise<void> {
    const user = await this.userRepository.findUserByNickname(nickname);

    if (user) throw new BadRequestException('닉네임이 이미 존재합니다.');
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
