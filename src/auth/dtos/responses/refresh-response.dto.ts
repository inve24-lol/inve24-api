import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RefreshResponseDto {
  @ApiProperty({
    description: 'Access Token',
    type: String,
  })
  @Expose()
  accessToken!: string;
}
