import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'make',
    example: 'ford',
  })
  @IsString()
  make: string;

  @ApiProperty({
    description: 'model',
    example: 'mustang',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'year',
    example: 1980,
  })
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @ApiProperty({
    description: 'mileage',
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @ApiProperty({
    description: 'lat',
    example: 45,
  })
  @IsLatitude()
  lat: number;

  @ApiProperty({
    description: 'lng',
    example: 45,
  })
  @IsLongitude()
  lng: number;

  @ApiProperty({
    description: 'price',
    example: 10000,
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
