import { TableColumnOptions } from 'typeorm';

export const generatePrimaryColumn = (comment: string = 'ID'): TableColumnOptions => {
  return {
    name: 'id',
    type: 'int',
    unsigned: true,
    isPrimary: true,
    isNullable: false,
    isGenerated: true,
    generationStrategy: 'increment',
    comment,
  };
};

export const generateCreatedAtColumn = (comment: string = 'Creation Date'): TableColumnOptions => {
  return {
    name: 'created_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
    comment,
  };
};

export const generateUpdatedAtColumn = (
  comment: string = 'Modification Date',
): TableColumnOptions => {
  return {
    name: 'updated_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment,
  };
};
