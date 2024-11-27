import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SendEmailCertCodeResponseDto {
  @ApiProperty({
    description: 'User Email',
    example: 'example@eamil.com',
  })
  @Expose()
  email!: string;
}
