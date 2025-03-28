import { Injectable, NestMiddleware, Inject, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Connection } from 'mongoose';
import { TenantSchema } from './tenant.schema';
import { UserSchema } from 'src/auth/user.schema'; // Import UserSchema

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(@Inject('DATABASE_CONNECTION') private readonly dbConnection: Connection) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required in headers');
    }

    // Attach tenant-specific schema if not already created
    if (!this.dbConnection.models[`${tenantId}_Tenant`]) {
      this.dbConnection.model(`${tenantId}_Tenant`, TenantSchema, `${tenantId}_Tenants`);
    }

    if (!this.dbConnection.models[`${tenantId}_User`]) {
      this.dbConnection.model(`${tenantId}_User`, UserSchema, `${tenantId}_users`);
    }

    req['tenantId'] = tenantId;
    req['tenantModel'] = this.dbConnection.models[`${tenantId}_Tenant`];
    req['userModel'] = this.dbConnection.models[`${tenantId}_User`];

    next();
  }
}
