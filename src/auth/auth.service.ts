import { Injectable, UnauthorizedException, Scope } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable({ scope: Scope.REQUEST }) // Request-scoped for multi-tenancy
export class AuthService {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    private readonly jwtService: JwtService,
  ) {}

  private getUserModel(): Model<User> {
    return this.request['userModel'];
  }

  async signup(name: string, email: string, password: string) {
    const userModel = this.getUserModel();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    return user.save();
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
