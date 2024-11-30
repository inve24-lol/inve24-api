import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterSummonerRequestDto {
  @ApiProperty({
    description: 'RSO 인증 접근 코드',
  })
  @IsNotEmpty()
  @IsString()
  readonly rsoAccessCode!: string;
}
