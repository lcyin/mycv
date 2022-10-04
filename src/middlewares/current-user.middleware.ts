import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: User;
//     }
//   }
// }

@Injectable()
export class CurrentUserMiddle implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: any, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }
    next();
  }
}
