import { Module } from '@nestjs/common';
import { TenantsModule } from './tenants/tenants.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, TenantsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
