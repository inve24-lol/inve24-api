import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthPayloadDto {
  @Expose()
  readonly uuid!: string;
}
