import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '@users/dto/internals/user-profile.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignUpResponseDto {
  @ApiProperty({
    description: '유저 프로필',
    type: UserProfileDto,
  })
  @Expose()
  readonly userProfile!: UserProfileDto;
}
