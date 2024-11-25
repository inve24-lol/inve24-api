import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '@core/type-orm/entities/user.entity';

@Entity('token')
@Unique('UQ_IDX_token_user_uuid', ['userUuid'])
export class TokenEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    unsigned: true,
    comment: 'Token ID (PK, NN, UN, AI)',
  })
  id!: number;

  @Column('varchar', {
    name: 'user_uuid',
    length: 36,
    comment: 'User UUID (FK, NN, UQ)',
  })
  userUuid!: string;

  @Column('char', {
    name: 'refresh_token',
    length: 60,
    comment: 'Refresh Token (NN)',
  })
  refreshToken!: string;

  @Column('timestamp', {
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Token Modification Date (NN)',
  })
  updatedAt!: Date;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Token Creation Date (NN)',
  })
  createdAt!: Date;

  @OneToOne(() => UserEntity, (user) => user.token, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_uuid',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_token_user_uuid',
  })
  user!: UserEntity;
}
