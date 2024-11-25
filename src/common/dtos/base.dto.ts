import { IBase } from '@common/interfaces/base.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseDto implements IBase {
  @ApiProperty({
    description: 'ID',
  })
  @Expose()
  readonly id!: number;

  @ApiProperty({
    description: 'Modification Date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  readonly updatedAt!: Date;

  @ApiProperty({
    description: 'Creation Date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  readonly createdAt!: Date;
}
