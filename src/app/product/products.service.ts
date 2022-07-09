import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../app/product/entities/product.entity';
import { CreateProductDto } from '../../app/product/dto/create-product.dto';
import { UpdateProductDto } from '../../app/product/dto/update-product.dto';
import { RedisCacheService } from '../../cache/cache.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    @Inject()
    private cacheService: RedisCacheService,
  ) {}

  async create({ title, description, price }: CreateProductDto) {
    const product = await this.repository.save(
      this.repository.create({
        title,
        description,
        price,
      }),
    );
    await this.cacheService.set(`product:${product.id}`, product);
    return product;
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.repository.find();
  }

  async findOneOrFail(id: string): Promise<ProductEntity | any> {
    const product = this.findOneByCache(id);
    if (!product) {
      return await this.repository.findOneOrFail({ where: { id } });
    }
    return product;
  }

  async findOneByCache(id: string): Promise<ProductEntity | any> {
    return await this.cacheService.get(`product-${id}`);
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await this.findOneOrFail(id);
    this.repository.merge(product, data);
    return await this.repository.save(product);
  }

  async deleteById(id: string) {
    await this.findOneOrFail(id);
    await this.repository.softDelete(id);
  }
}
