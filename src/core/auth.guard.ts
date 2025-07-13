import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { extractToken } from './utils/extract-token';
import { Authenticator } from '../users/services/authenticator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticator: Authenticator) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers.authorization;

    if (!headers) return false;

    const token = extractToken(headers);

    if (!token) return false;

    try {
      const user = await this.authenticator.validateUser(token);
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
