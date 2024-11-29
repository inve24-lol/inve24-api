import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RsoAccessUrlResponseDto {
  @ApiProperty({
    description: 'RSO 요청 주소',
    example: '${HOST}/${ENDPOINT}?client_id=&redirect_uri=&response_type=&scope=',
  })
  @Expose()
  rsoAccessUrl!: string;
}
