import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RiotApiAuthHeaderDto {
  @ApiProperty({
    description: '라이엇 API 요청 헤더',
  })
  @Expose({ name: 'authorization' })
  readonly Authorization!: string;
}
