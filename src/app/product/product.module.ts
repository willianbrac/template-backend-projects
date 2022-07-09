import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from '../../cache/cache.module';
import { ProductEntity } from '../../app/product/entities/product.entity';
import { ProductsController } from '../../app/product/products.controller';
import { ProductsService } from '../../app/product/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    RedisCacheModule,
    ProductModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductModule {}
