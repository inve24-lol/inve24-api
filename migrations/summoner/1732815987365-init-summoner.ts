import {
  generateCreatedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/common/__common';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class InitSummoner1732815987365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'summoner',
        columns: [
          generatePrimaryColumn('소환사 고유 ID (PK, NN, UN, AI)'),
          new TableColumn({
            name: 'user_uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
            comment: '유저 UUID (FK, NN)',
          }),
          new TableColumn({
            name: 'puuid',
            type: 'char',
            length: '78',
            isNullable: false,
            comment: '소환사 PUUID (NN, UQ)',
          }),
          new TableColumn({
            name: 'game_name',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '소환사 이름 (NN)',
          }),
          new TableColumn({
            name: 'tag_line',
            type: 'varchar',
            length: '10',
            isNullable: false,
            comment: '소환사 태그 (NN)',
          }),
          new TableColumn({
            name: 'summoner_level',
            type: 'int',
            isNullable: false,
            comment: '소환사 레벨 (NN)',
          }),
          new TableColumn({
            name: 'profile_icon_id',
            type: 'int',
            isNullable: false,
            comment: '소환사 프로필 아이콘 ID (NN)',
          }),
          new TableColumn({
            name: 'tier',
            type: 'varchar',
            length: '20',
            isNullable: false,
            default: "'UNRANKED'",
            comment: '소환사 티어 (NN)',
          }),
          new TableColumn({
            name: 'rank',
            type: 'varchar',
            length: '10',
            isNullable: false,
            default: "'UNRANKED'",
            comment: '소환사 랭크 (NN)',
          }),
          new TableColumn({
            name: 'league_points',
            type: 'int',
            isNullable: false,
            default: 0,
            comment: '소환사 리그 점수 (NN)',
          }),
          new TableColumn({
            name: 'wins',
            type: 'int',
            isNullable: false,
            default: 0,
            comment: '소환사 승리 횟수 (NN)',
          }),
          new TableColumn({
            name: 'losses',
            type: 'int',
            isNullable: false,
            default: 0,
            comment: '소환사 패배 횟수 (NN)',
          }),
          generateUpdatedAtColumn('수정 일자 (NN)'),
          generateCreatedAtColumn('생성 일자 (NN)'),
        ],
        foreignKeys: [
          {
            name: 'FK_summoner_user_uuid',
            columnNames: ['user_uuid'],
            referencedTableName: 'user',
            referencedColumnNames: ['uuid'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_IDX_summoner_puuid',
            columnNames: ['puuid'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('summoner');
  }
}
