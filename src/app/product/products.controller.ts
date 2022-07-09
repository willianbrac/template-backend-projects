import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../../app/product/dto/create-product.dto';
import { UpdateProductDto } from '../../app/product/dto/update-product.dto';
import { ProductsService } from '../../app/product/products.service';
import { CreateProductSwagger } from '../../app/product/swagger/create-product.swagger';
import { IndexProductSwagger } from '../../app/product/swagger/index-product.swagger';
import { ShowProductSwagger } from '../../app/product/swagger/show-product.swagger';
import { UpdateProductSwagger } from '../../app/product/swagger/update-product.swagger';
import { BadRequestSwagger } from './helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from './helpers/swagger/not-found.swagger';

@Controller('api/product')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({
    status: 200,
    description: 'Products return successfully',
    type: IndexProductSwagger,
    isArray: true,
  })
  async index() {
    return await this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: CreateProductSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid params',
    type: BadRequestSwagger,
  })
  async create(@Body() { title, description, price }: CreateProductDto) {
    return await this.service.create({ title, description, price });
  }

  @Get(':id')
  @ApiOperation({ summary: 'View a products data' })
  @ApiResponse({
    status: 201,
    description: 'Product data',
    type: ShowProductSwagger,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.service.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product data' })
  @ApiResponse({
    status: 200,
    description: 'Product updated with success',
    type: UpdateProductSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'invalid data',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: NotFoundSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateProductDto,
  ) {
    return await this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a product' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: NotFoundSwagger,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.deleteById(id);
  }
}
