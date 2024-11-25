import { generateCreatedAtColumn, generatePrimaryColumn } from 'migrations/utils/utile';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreatedToken1732541377525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'token',
        columns: [
          generatePrimaryColumn('Token ID (PK, NN, UN, AI)'),
          new TableColumn({
            name: 'user_uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
            comment: 'User UUID (FK, NN, UQ)',
          }),
          new TableColumn({
            name: 'refresh_token',
            type: 'char',
            length: '60',
            isNullable: false,
            comment: 'Refresh Token (NN)',
          }),
          generateCreatedAtColumn('Token Creation Date (NN)'),
        ],
        foreignKeys: [
          {
            name: 'FK_token_user_uuid',
            columnNames: ['user_uuid'],
            referencedTableName: 'user',
            referencedColumnNames: ['uuid'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_IDX_token_user_uuid',
            columnNames: ['user_uuid'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('token');
  }
}
