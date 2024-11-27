import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SendEmailVerificationCodeResponseDto {
  @ApiProperty({
    description: 'User Email',
    example: 'example@eamil.com',
  })
  @Expose()
  email!: string;
}
