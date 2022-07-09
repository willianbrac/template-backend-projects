import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from '../../app/product/dto/create-product.dto';
import { UpdateProductDto } from '../../app/product/dto/update-product.dto';
import { ProductEntity } from '../../app/product/entities/product.entity';
import { ProductsService } from '../../app/product/products.service';
import { Repository } from 'typeorm';

const productsEntityList: ProductEntity[] = [
  new ProductEntity({
    title: 'Shoe',
    description: 'Bealtifull shoe',
    price: 2.5,
  }),
  new ProductEntity({
    title: 'Pen',
    description: 'BIC pen',
    price: 0.5,
  }),
  new ProductEntity({
    title: 'Windows 10',
    description: '',
    price: 900,
  }),
];

const updatedProductEntityItem = new ProductEntity({
  title: 'Shoe Blue',
  description: 'New blue shoe',
  price: 3.0,
});

describe('ProductService', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(productsEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(productsEntityList[0]),
            findOne: jest.fn().mockResolvedValue(productsEntityList[0]),
            create: jest.fn().mockReturnValue(productsEntityList[0]),
            merge: jest.fn().mockReturnValue(updatedProductEntityItem),
            save: jest.fn().mockResolvedValue(productsEntityList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();
    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(productsRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should be able to return a product list ', async () => {
      const result = await productsService.findAll();
      expect(result).toEqual(productsEntityList);
      expect(productsRepository.find).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      jest.spyOn(productsRepository, 'find').mockRejectedValueOnce(new Error());
      expect(productsService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should be able to return a product', async () => {
      const result = await productsService.findOneOrFail('1');
      expect(result).toEqual(productsEntityList[0]);
      expect(productsRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('should throw a not found exception', () => {
      jest
        .spyOn(productsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      expect(productsService.findOneOrFail('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new product entity item successfully', async () => {
      const data: CreateProductDto = {
        title: 'Shoe',
        description: 'Bealtifull shoe',
        price: 2.5,
      };
      const result = await productsService.create(data);
      expect(result).toEqual(productsEntityList[0]);
      expect(productsRepository.create).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      const data: CreateProductDto = {
        title: 'Shoe',
        description: 'Bealtifull shoe',
        price: 2.5,
      };
      jest.spyOn(productsRepository, 'save').mockRejectedValueOnce(new Error());
      expect(productsService.create(data)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a product entity item successfully', async () => {
      const data: UpdateProductDto = {
        title: 'Shoe Blue',
        description: 'New blue shoe',
        price: 3.0,
      };
      jest
        .spyOn(productsRepository, 'save')
        .mockResolvedValueOnce(updatedProductEntityItem);
      const result = await productsService.update('1', data);
      expect(result).toEqual(updatedProductEntityItem);
    });
    it('should throw a not found exception', () => {
      jest
        .spyOn(productsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      const data: UpdateProductDto = {
        title: 'Shoe Blue',
        description: 'New blue shoe',
        price: 3.0,
      };
      expect(productsService.update('1', data)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should throw an exception', () => {
      jest.spyOn(productsRepository, 'save').mockRejectedValueOnce(new Error());
      const data: UpdateProductDto = {
        title: 'Shoe Blue',
        description: 'New blue shoe',
        price: 3.0,
      };
      expect(productsService.update('1', data)).rejects.toThrowError();
    });
  });

  describe('deleteById', () => {
    it('should delete a product entity item successfully', async () => {
      const result = await productsService.deleteById('1');
      expect(result).toBeUndefined();
      expect(productsRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(productsRepository.softDelete).toHaveBeenCalledTimes(1);
    });
    it('should throw a not found exception', () => {
      jest
        .spyOn(productsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      expect(productsService.deleteById('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should throw an exception', () => {
      jest
        .spyOn(productsRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());
      expect(productsService.deleteById('1')).rejects.toThrowError();
    });
  });
});
