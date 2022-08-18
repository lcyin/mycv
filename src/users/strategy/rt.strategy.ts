import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      // how are we get token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // use to sign the token
      secretOrKey: 'rtsecret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
