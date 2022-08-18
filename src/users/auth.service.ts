import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { IsNull, Not } from 'typeorm';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'atsecret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'rtsecret',
        expiresIn: '7 days',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signup(email: string, password: string) {
    // See the email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    // Generate a salt
    const salt = randomBytes(8).toString('hex'); // turn 0101 to hex string -> 1 byte turn to 2 string
    // Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const user = await this.usersService.create(email, result);
    // Return the user
    return user;
  }
  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.hash.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }

  async signupLocal(email: string, password: string): Promise<Tokens> {
    // See the email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    const hash = await this.hashData(password);
    const user = await this.usersService.create(email, hash);
    const tokens = await this.getTokens(user.id, user.email);
    const result = await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(email: string, password: string): Promise<Tokens> {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const passwordMatch = bcrypt.compare(password, user.hash);
    if (!passwordMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    return await this.usersService.update(userId, { hashedRt: hash });
  }

  async logoutLocal(userId: number) {
    const [user] = await this.usersService.findByWhere([
      { id: userId, hashedRt: Not(IsNull()) },
    ]);
    if (!user) {
      throw new NotFoundException('update user not found');
    }
    return await this.usersService.update(user.id, { hashedRt: null });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRt) {
      throw new NotFoundException('Access Denied');
    }
    const rtMatches = bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) {
      throw new NotFoundException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
