import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveSummonerRequestDto {
  @ApiProperty({
    description: '소환사 고유 ID',
  })
  @IsNotEmpty()
  @IsString()
  readonly summonerId!: string;
}
