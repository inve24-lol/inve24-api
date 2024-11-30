import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RsoAuthCredentialsDto {
  @ApiProperty({
    description: 'RSO 인증 Client ID',
  })
  @Expose({ name: 'clientId' })
  readonly username!: string;

  @ApiProperty({
    description: 'RSO 인증 Client Secret',
  })
  @Expose({ name: 'clientSecret' })
  readonly password!: string;
}
