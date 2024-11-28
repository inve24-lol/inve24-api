import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class VerifyEmailCertCodeResponseDto {
  @ApiProperty({
    description: '유저 이메일',
    example: 'example@eamil.com',
  })
  @Expose()
  email!: string;
}
