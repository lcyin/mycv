import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AtGuard } from './guards';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['asdfasdf'], // encrypt information
  //   }),
  // );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useGlobalGuards(new AtGuard());
  await app.listen(3000);
}
bootstrap();
