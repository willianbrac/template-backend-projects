import { OmitType } from '@nestjs/swagger';
import { ProductEntity } from '../../../app/product/entities/product.entity';

export class IndexProductSwagger extends OmitType(ProductEntity, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
