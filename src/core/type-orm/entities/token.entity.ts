import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@core/type-orm/entities/user.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'Token Uuid (PK, NN)',
  })
  id!: string;

  @Column('varchar', {
    name: 'user_id',
    length: 36,
    comment: 'User UUID (FK, NN, UQ)',
  })
  userId!: string;

  @Column('varchar', {
    name: 'refresh_token',
    length: 60,
    comment: 'Refresh Token (NN)',
  })
  refreshToken!: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Token Creation Date (NN)',
  })
  createdAt!: Date;

  @OneToOne(() => UserEntity, (user) => user.token, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_refresh_token_user_id',
  })
  user!: UserEntity;
}
