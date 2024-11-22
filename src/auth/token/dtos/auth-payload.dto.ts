import { IPayload } from '@token/interfaces/payload.interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthPayloadDto implements Pick<IPayload, 'id'> {
  @Expose()
  readonly id!: string;
}
