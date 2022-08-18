import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      // check isPublic if exist in order
      context.getHandler(), // route handler
      context.getClass(), // controller class
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
