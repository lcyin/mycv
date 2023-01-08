import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @ApiProperty({
    description: 'email',
    example: 'test@test.com',
  })
  @Expose()
  email: string;
}
