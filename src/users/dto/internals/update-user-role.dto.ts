import { Role } from '@common/constants/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateUserRoleDto {
  @ApiProperty({
    description: '유저 고유 ID',
  })
  @Expose()
  readonly id!: number;

  @ApiProperty({
    description: '유저 역할',
    enum: Role,
    example: 'GUEST',
  })
  @Expose()
  readonly role!: Role;
}
