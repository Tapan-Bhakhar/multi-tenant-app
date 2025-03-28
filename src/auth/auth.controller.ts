import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('tenantKey') tenantKey: string,
    @Body('userType') userType: string,
  ){
    if (!name || !email || !password || !tenantKey || !userType) {
      throw new BadRequestException('Missing required fields');
    }

    if(userType !== 'tenant' && userType !== 'user') {
      throw new BadRequestException(`Invalid user type. Allowed values: 'tenant' or 'user'.`);
    }

    return this.authService.signup(name, email, password, tenantKey, userType);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
