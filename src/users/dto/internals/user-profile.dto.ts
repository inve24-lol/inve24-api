import { Role } from '@common/constants/roles.enum';
import { BaseDto } from '@common/dtos/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserProfileDto extends BaseDto {
  @ApiProperty({
    description: '유저 UUID',
  })
  @Expose()
  readonly uuid!: string;

  @ApiProperty({
    description: '유저 이메일',
    example: 'example@eamil.com',
  })
  @Expose()
  readonly email!: string;

  @ApiProperty({
    description: '유저 닉네임',
  })
  @Expose()
  readonly nickname!: string;

  @ApiProperty({
    description: '유저 역할',
    enum: Role,
    example: 'GUEST',
  })
  @Expose()
  readonly role!: Role;
}
