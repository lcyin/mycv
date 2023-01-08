import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ApproveReportDto {
  @ApiProperty({
    description: 'approved',
    example: false,
  })
  @IsBoolean()
  approved: boolean;
}
