import { Column, Entity, Generated, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TokenEntity } from '@core/type-orm/entities/token.entity';
import { Role } from '@common/constants/roles.enum';

@Index('UQ_IDX_user_uuid', ['uuid'], { unique: true })
@Index('UQ_IDX_user_email', ['email'], { unique: true })
@Index('UQ_IDX_user_nickname', ['nickname'], { unique: true })
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    unsigned: true,
    comment: 'User ID (PK, NN, UN, AI)',
  })
  id!: number;

  @Column('uuid', {
    name: 'uuid',
    comment: 'User UUID (NN, UQ)',
  })
  @Generated('uuid')
  uuid!: string;

  @Column('varchar', {
    name: 'email',
    length: 50,
    comment: 'User Email (NN, UQ)',
  })
  email!: string;

  @Column('varchar', {
    name: 'password',
    length: 60,
    comment: 'User Password (NN)',
  })
  password!: string;

  @Column('varchar', {
    name: 'nickname',
    length: 10,
    comment: 'User Nickname (NN, UQ)',
  })
  nickname!: string;

  @Column('enum', {
    name: 'role',
    enum: Role,
    default: Role.GUEST,
    comment: 'User Role (NN)',
  })
  role!: Role;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'User Creation Date (NN)',
  })
  createdAt!: Date;

  @OneToOne(() => TokenEntity, (token) => token.user)
  token!: TokenEntity;
}
