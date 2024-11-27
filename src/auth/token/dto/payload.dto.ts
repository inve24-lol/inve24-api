import { IPayload } from '@token/interfaces/payload.interface';
import { Role } from '@common/constants/roles.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PayloadDto implements IPayload {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly nickname!: string;

  @Expose()
  readonly role!: Role;
}
