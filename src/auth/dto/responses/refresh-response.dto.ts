import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RefreshResponseDto {
  @ApiProperty({
    description: '엑세스 토큰',
    type: String,
  })
  @Expose()
  accessToken!: string;
}
