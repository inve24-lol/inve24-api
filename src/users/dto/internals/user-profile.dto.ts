import { Role } from '@common/constants/roles.enum';
import { BaseDto } from '@common/dtos/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IUserProfile } from '@users/interfaces/user.profile.interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserProfileDto extends BaseDto implements IUserProfile {
  @ApiProperty({
    description: 'User UUID',
  })
  @Expose()
  readonly uuid!: string;

  @ApiProperty({
    description: 'User Email',
    example: 'example@eamil.com',
  })
  @Expose()
  readonly email!: string;

  @ApiProperty({
    description: 'User Nickname',
  })
  @Expose()
  readonly nickname!: string;

  @ApiProperty({
    description: 'User Role',
    enum: Role,
    example: 'GUEST',
  })
  @Expose()
  readonly role!: Role;
}
