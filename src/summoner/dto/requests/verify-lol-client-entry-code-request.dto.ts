import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifySocketEntryCodeRequest {
  @ApiProperty({
    description: '소켓 입장 인증 코드',
  })
  @IsNotEmpty()
  @IsString()
  readonly socketEntryCode!: string;
}
