import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @ApiProperty({
    description: 'price',
    example: 10000,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'approved',
    example: false,
  })
  @Expose()
  approved: boolean;
  @ApiProperty({
    description: 'year',
    example: 1980,
  })
  @Expose()
  year: number;
  @ApiProperty({
    description: 'lng',
    example: 45,
  })
  @Expose()
  lng: number;
  @ApiProperty({
    description: 'lat',
    example: 45,
  })
  @Expose()
  lat: number;
  @ApiProperty({
    description: 'make',
    example: 'ford',
  })
  @Expose()
  make: string;
  @ApiProperty({
    description: 'model',
    example: 'mustang',
  })
  @Expose()
  model: string;
  @ApiProperty({
    description: 'mileage',
    example: 50000,
  })
  @Expose()
  mileage: number;
  @ApiProperty({
    description: 'user who create the report',
    example: 1,
  })
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
