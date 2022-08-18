import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
// import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import {
  CurrentUser,
} from './decorator/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { TokensDto } from './dtos/tokens.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard, RtGuard } from '../guards';
import { Public } from './decorator/public.decorator';
import { GetCurrentUserId } from './decorator/get-current-user-id.decorator';
import { GetCurrentUser } from './decorator/get-current-user.decorator';

@Controller('auth')
// format outgoing responses
// @Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  @Get('/whoami')
  // @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Public()
  // @Serialize(TokensDto)
  @Post('/signupLocal')
  @HttpCode(HttpStatus.CREATED)
  async createUserLocal(@Body() body: CreateUserDto) {
    return await this.authService.signupLocal(body.email, body.password);
  }

  @Public()
  @Post('/signinLocal')
  @HttpCode(HttpStatus.OK)
  async signinUserLocal(@Body() body: CreateUserDto) {
    return await this.authService.signinLocal(body.email, body.password);
  }

  @Post('/logoutLocal')
  @HttpCode(HttpStatus.OK)
  async logoutLocal(@GetCurrentUserId() userId: number) {
    return await this.authService.logoutLocal(userId);
  }

  @Public()
  @Post('/refreshLocal')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshLocal(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Post('/refresh')
  // refreshTokens() {
  //   return this.authService.refreshTokens();
  // }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
