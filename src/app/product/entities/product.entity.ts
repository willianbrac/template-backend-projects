import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'decimal' })
  price: number;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  description: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  constructor(product?: Partial<ProductEntity>) {
    this.id = product?.id;
    this.title = product?.title;
    this.price = product?.price;
    this.description = product?.description;
    this.createdAt = product?.createdAt;
    this.updatedAt = product?.updatedAt;
    this.deletedAt = product?.deletedAt;
  }
}
