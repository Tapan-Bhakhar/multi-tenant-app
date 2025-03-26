import { Injectable, Scope } from '@nestjs/common';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class AuthService {
    constructor() {
        console.log('AuthService created');
    }
}
