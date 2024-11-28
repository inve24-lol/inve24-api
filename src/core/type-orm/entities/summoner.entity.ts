import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('summoner')
@Unique('UQ_IDX_summoner_user_uuid', ['userUuid'])
@Unique('UQ_IDX_summoner_puuid', ['puuid'])
export class SummonerEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    unsigned: true,
    comment: '소환사 고유 ID (PK, NN, UN, AI)',
  })
  id!: number;

  @Column('varchar', {
    name: 'user_uuid',
    length: 36,
    comment: '유저 UUID (FK, NN, UQ)',
  })
  userUuid!: string;

  @Column('char', {
    name: 'puuid',
    length: 78,
    comment: '소환사 PUUID (NN, UQ)',
  })
  puuid!: string;

  @Column('varchar', {
    name: 'game_name',
    length: 20,
    comment: '소환사 이름 (NN)',
  })
  gameName!: string;

  @Column('varchar', {
    name: 'tag_line',
    length: 10,
    comment: '소환사 태그 (NN)',
  })
  tagLine!: string;

  @Column('int', {
    name: 'summoner_level',
    comment: '소환사 레벨 (NN)',
  })
  summonerLevel!: number;

  @Column('int', {
    name: 'profile_icon_id',
    comment: '소환사 프로필 아이콘 ID (NN)',
  })
  profileIconId!: number;

  @Column('varchar', {
    name: 'tier',
    length: 20,
    default: 'UNRANKED',
    comment: '소환사 티어 (NN)',
  })
  tier!: string;

  @Column('varchar', {
    name: 'rank',
    length: 10,
    default: 'UNRANKED',
    comment: '소환사 랭크 (NN)',
  })
  rank!: string;

  @Column('int', {
    name: 'league_points',
    default: 0,
    comment: '소환사 리그 점수 (NN)',
  })
  leaguePoints!: number;

  @Column('int', {
    name: 'wins',
    default: 0,
    comment: '소환사 승리 횟수 (NN)',
  })
  wins!: number;

  @Column('int', {
    name: 'losses',
    default: 0,
    comment: '소환사 패배 횟수 (NN)',
  })
  losses!: number;

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

  @ManyToOne(() => UserEntity, (user) => user.summoners, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_uuid',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_summoner_user_uuid',
  })
  user!: UserEntity;
}
