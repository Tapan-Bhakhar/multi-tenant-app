import { Injectable, UnauthorizedException, Scope, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Tenant } from 'src/tenants/tenant.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable({ scope: Scope.REQUEST }) // Request-scoped for multi-tenancy
export class AuthService {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    private readonly jwtService: JwtService,
    // @InjectModel(User.name) private readonly userModel: Model<User>,
    // @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
  ) { }

  private getUserModel(): Model<User> {
    return this.request['userModel'];
  }

  private getTenantModel(): Model<Tenant> {
    return this.request['tenantModel'];
  }

  async signup(name: string, email: string, password: string, tenantKey: string, userType: string) {
    const userModel = this.getUserModel();
    const tenantModel = this.getTenantModel();
    if (userType === "tenant") {
      // Check if the tenant already exists
      const existingTenant = await tenantModel.findOne({ tenantKey });
      if (existingTenant) {
          throw new UnauthorizedException("Tenant already exists.");
      }

      // Create new tenant
      const tenant = new tenantModel({ 
        name: name,
        email: email,
        password: password,
        tenantKey 
      });
      await tenant.save();

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create tenant owner in userModel
      const tenantOwner = new userModel({
          name,
          email,
          password: hashedPassword,
          tenant: tenant._id,
          userType: "tenant",
      });

      return tenantOwner.save();
  }

    if (userType === 'user') {
      const tenant = await tenantModel.findOne({ tenantKey });
      if (!tenant) {
        throw new UnauthorizedException('Invalid tenant key. Signup not allowed.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
        tenant: tenant._id,
        userType: "user",
      });

      return user.save();
    }

    throw new BadRequestException("Invalid user type. Allowed values: 'tenant' or 'user'.");

  }

  async login(email: string, password: string) {
    const userModel = this.getUserModel();
    const user = await userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.jwtService.sign({ email, id: user._id }),
    };
  }
}
