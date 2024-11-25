import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@core/type-orm/entities/user.entity';

@Entity('token')
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

  @Column('varchar', {
    name: 'refresh_token',
    length: 60,
    comment: 'Refresh Token (NN)',
  })
  refreshToken!: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
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
    foreignKeyConstraintName: 'FK_refresh_token_user_uuid',
  })
  user!: UserEntity;
}
