import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../../app/product/dto/create-product.dto';
import { UpdateProductDto } from '../../app/product/dto/update-product.dto';
import { ProductEntity } from '../../app/product/entities/product.entity';
import { ProductsController } from '../../app/product/products.controller';
import { ProductsService } from '../../app/product/products.service';

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

const newProductEntity = new ProductEntity({
  title: 'Shoe',
  description: 'Bealtifull shoe',
  price: 2.5,
});

const updatedProductEntity = new ProductEntity({
  title: 'football shoes 35 US',
  description: 'football boots nike',
  price: 199,
});

describe('ProductController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(productsEntityList),
            create: jest.fn().mockResolvedValue(newProductEntity),
            findOneOrFail: jest.fn().mockResolvedValue(productsEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedProductEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
    expect(productsService).toBeDefined();
  });

  describe('index', () => {
    it('should return a products list entity successfully', async () => {
      const result = await productsController.index();
      expect(result).toEqual(productsEntityList);
      expect(typeof result).toEqual('object');
      expect(productsService.findAll).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      jest.spyOn(productsService, 'findAll').mockRejectedValueOnce(new Error());
      expect(productsController.index()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      const body: CreateProductDto = {
        title: 'Shoe',
        description: 'Bealtifull shoe',
        price: 2.5,
      };
      const result = await productsController.create(body);
      expect(result).toEqual(newProductEntity);
      expect(productsService.create).toHaveBeenCalledTimes(1);
      expect(productsService.create).toHaveBeenCalledWith(body);
    });
    it('should throw an exception', () => {
      const body: CreateProductDto = {
        title: 'Shoe',
        description: 'Bealtifull shoe',
        price: 2.5,
      };
      jest.spyOn(productsService, 'create').mockRejectedValueOnce(new Error());
      expect(productsController.create(body)).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should get a product item successfully', async () => {
      const result = await productsController.show('1');
      expect(result).toEqual(productsEntityList[0]);
      expect(productsService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(productsService.findOneOrFail).toHaveBeenCalledWith('1');
    });
    it('should throw an exception', () => {
      jest
        .spyOn(productsService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      expect(productsController.show('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a product item successfully', async () => {
      const body: UpdateProductDto = {
        title: 'football shoes 35 US',
        description: 'football boots nike',
        price: 199,
      };
      const result = await productsController.update('1', body);
      expect(result).toEqual(updatedProductEntity);
      expect(productsService.update).toHaveBeenCalledTimes(1);
      expect(productsService.update).toHaveBeenCalledWith('1', body);
    });
    it('should throw an exception', () => {
      const body: UpdateProductDto = {
        title: 'football shoes 35 US',
        description: 'football boots nike',
        price: 199,
      };
      jest.spyOn(productsService, 'update').mockRejectedValueOnce(new Error());
      expect(productsController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should remove a product item successfully', async () => {
      const result = await productsController.destroy('1');
      expect(result).toBeUndefined();
    });
    it('should throw an exception', () => {
      jest
        .spyOn(productsService, 'deleteById')
        .mockRejectedValueOnce(new Error());
      expect(productsController.destroy('1')).rejects.toThrowError();
    });
  });
});
