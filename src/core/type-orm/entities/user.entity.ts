import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '@common/constants/roles.enum';

@Entity('user')
@Unique('UQ_IDX_user_uuid', ['uuid'])
@Unique('UQ_IDX_user_email', ['email'])
@Unique('UQ_IDX_user_nickname', ['nickname'])
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

  @Column('char', {
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

  @Column('timestamp', {
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'User Modification Date (NN)',
  })
  updatedAt!: Date;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'User Creation Date (NN)',
  })
  createdAt!: Date;
}
