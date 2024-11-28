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
    comment: '유저 고유 ID (PK, NN, UN, AI)',
  })
  id!: number;

  @Column('uuid', {
    name: 'uuid',
    comment: '유저 UUID (NN, UQ)',
  })
  @Generated('uuid')
  uuid!: string;

  @Column('varchar', {
    name: 'email',
    length: 50,
    comment: '유저 이메일 (NN, UQ)',
  })
  email!: string;

  @Column('char', {
    name: 'password',
    length: 60,
    comment: '유저 비밀번호 (NN)',
  })
  password!: string;

  @Column('varchar', {
    name: 'nickname',
    length: 10,
    comment: '유저 닉네임 (NN, UQ)',
  })
  nickname!: string;

  @Column('enum', {
    name: 'role',
    enum: Role,
    default: Role.GUEST,
    comment: '유저 역할 (NN)',
  })
  role!: Role;

  @Column('timestamp', {
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '수정 일자 (NN)',
  })
  updatedAt!: Date;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '생성 일자 (NN)',
  })
  createdAt!: Date;
}
