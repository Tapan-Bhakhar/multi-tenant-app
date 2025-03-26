import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TenantMiddleware } from './tenants/tenant.middleware';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
