import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDecimal, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
