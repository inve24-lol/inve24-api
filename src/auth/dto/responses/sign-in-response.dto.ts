import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '@users/dto/internals/user-profile.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignInResponseDto {
  @ApiProperty({
    description: 'User Profile',
    type: UserProfileDto,
  })
  @Expose()
  readonly userProfile!: UserProfileDto;

  @ApiProperty({
    description: 'Access Token',
  })
  @Expose()
  readonly accessToken!: string;
}
