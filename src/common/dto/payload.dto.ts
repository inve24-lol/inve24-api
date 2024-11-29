import { Role } from '@common/constants/roles.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PayloadDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly nickname!: string;

  @Expose()
  readonly role!: Role;
}
