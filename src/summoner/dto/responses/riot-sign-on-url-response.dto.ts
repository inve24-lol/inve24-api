import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RiotSignOnUrlResponseDto {
  @ApiProperty({
    description: 'RSO 요청 주소',
    example: '${HOST}/${ENDPOINT}?client_id=&redirect_uri=&response_type=&scope=',
  })
  @Expose()
  riotSignOnUrl!: string;
}
