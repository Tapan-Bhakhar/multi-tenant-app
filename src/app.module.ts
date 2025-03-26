import { Module } from '@nestjs/common';
import { TenantsModule } from './tenants/tenants.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, TenantsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
