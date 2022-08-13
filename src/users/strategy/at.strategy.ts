import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      // how are we get token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // use to sign the token
      secretOrKey: 'at-secret',
    });
  }

  async validate(payload) {
    return payload;
  }
}
