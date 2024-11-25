import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { generateCreatedAtColumn, generatePrimaryColumn } from 'migrations/utils/utile';
import { Role } from 'src/common/constants/roles.enum';

export class CreatedUser1732537469871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          generatePrimaryColumn('User ID (PK, NN, UN, AI)'),
          new TableColumn({
            name: 'uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
            generationStrategy: 'uuid',
            comment: 'User UUID (NN, UQ)',
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: 'User Email (NN, UQ)',
          }),
          new TableColumn({
            name: 'password',
            type: 'char',
            length: '60',
            isNullable: false,
            comment: 'User Password (NN)',
          }),
          new TableColumn({
            name: 'nickname',
            type: 'varchar',
            length: '10',
            isNullable: false,
            comment: 'User Nickname (NN, UQ)',
          }),
          new TableColumn({
            name: 'role',
            type: 'enum',
            enum: Object.values(Role),
            isNullable: false,
            default: `'${Role.GUEST}'`,
            comment: 'User Role (NN)',
          }),
          generateCreatedAtColumn('User Creation Date (NN)'),
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
