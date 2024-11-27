import { IPayload } from '@token/interfaces/payload.interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthPayloadDto implements Pick<IPayload, 'uuid'> {
  @Expose()
  readonly uuid!: string;
}
