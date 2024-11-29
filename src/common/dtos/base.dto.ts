import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseDto {
  @ApiProperty({
    description: '고유 ID',
  })
  @Expose()
  readonly id!: number;

  @ApiProperty({
    description: '수정 일자',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  readonly updatedAt!: Date;

  @ApiProperty({
    description: '생성 일자',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  readonly createdAt!: Date;
}
