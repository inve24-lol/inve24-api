import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '@users/dto/internals/user-profile.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignInResponseDto {
  @ApiProperty({
    description: '유저 프로필',
    type: UserProfileDto,
  })
  @Expose()
  readonly userProfile!: UserProfileDto;

  @ApiProperty({
    description: '엑세스 토큰',
  })
  @Expose()
  readonly accessToken!: string;
}
