import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '@users/dtos/internals/user-profile.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignUpResponseDto {
  @ApiProperty({
    description: 'User Profile',
    type: UserProfileDto,
  })
  @Expose()
  readonly userProfile!: UserProfileDto;
}
