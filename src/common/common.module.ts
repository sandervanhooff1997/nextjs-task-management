import { Module } from '@nestjs/common';
import { DatabaseErrorCodes } from './enums/database-error-codes.enum';

@Module({})
export class CommonModule {
  exports: [DatabaseErrorCodes];
}
