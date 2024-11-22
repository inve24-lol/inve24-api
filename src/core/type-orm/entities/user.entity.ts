import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TokenEntity } from '@core/type-orm/entities/token.entity';
import { Role } from '@common/constants/roles.enum';

@Index('UQ_IDX_user_nickname', ['nickname'], { unique: true })
@Index('UQ_IDX_user_email', ['email'], { unique: true })
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'User Uuid (PK, NN)',
  })
  id!: string;

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
