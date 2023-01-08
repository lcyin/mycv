import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @ApiProperty({
    description: 'Primary key as Report ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'approved',
    example: false,
  })
  @Column({ default: false })
  approved: boolean;

  @ApiProperty({
    description: 'price',
    example: 10000,
  })
  @Column()
  price: number;

  @ApiProperty({
    description: 'make',
    example: 'ford',
  })
  @Column()
  make: string;

  @ApiProperty({
    description: 'model',
    example: 'mustang',
  })
  @Column()
  model: string;

  @ApiProperty({
    description: 'year',
    example: 1980,
  })
  @Column()
  year: number;

  @ApiProperty({
    description: 'lng',
    example: 45,
  })
  @Column()
  lng: number;

  @ApiProperty({
    description: 'lat',
    example: 45,
  })
  @Column()
  lat: number;

  @ApiProperty({
    description: 'mileage',
    example: 50000,
  })
  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
