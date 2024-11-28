import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import {
  generateCreatedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/common/__common';
import { Role } from 'src/common/constants/roles.enum';

export class InitUser1732537469871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          generatePrimaryColumn('유저 고유 ID (PK, NN, UN, AI)'),
          new TableColumn({
            name: 'uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
            generationStrategy: 'uuid',
            comment: '유저 UUID (NN, UQ)',
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: '유저 이메일 (NN, UQ)',
          }),
          new TableColumn({
            name: 'password',
            type: 'char',
            length: '60',
            isNullable: false,
            comment: '유저 비밀번호 (NN)',
          }),
          new TableColumn({
            name: 'nickname',
            type: 'varchar',
            length: '10',
            isNullable: false,
            comment: '유저 닉네임 (NN, UQ)',
          }),
          new TableColumn({
            name: 'role',
            type: 'enum',
            enum: Object.values(Role),
            isNullable: false,
            default: `'${Role.GUEST}'`,
            comment: '유저 역할 (NN)',
          }),
          generateUpdatedAtColumn('수정 일자 (NN)'),
          generateCreatedAtColumn('생성 일자 (NN)'),
        ],
        uniques: [
          {
            name: 'UQ_IDX_user_uuid',
            columnNames: ['uuid'],
          },
          {
            name: 'UQ_IDX_user_email',
            columnNames: ['email'],
          },
          {
            name: 'UQ_IDX_user_nickname',
            columnNames: ['nickname'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
