import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDecimal,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@Entity()
export class ProductRepository {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the product',
    format: 'uuid',
  })
  @IsUUID()
  id?: string;

  @Column({ unique: true }) // Contentful ID as unique
  @ApiProperty({
    description: 'Contentful ID of the product',
    example: 'abc123',
  })
  @IsString()
  contentfulId: string;

  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ description: 'Category of the product', required: false })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  category: string;

  @ApiProperty({ description: 'Price of the product', required: false })
  @IsOptional()
  @IsDecimal()
  @Column('decimal', { nullable: true })
  price: number;

  @ApiProperty({ description: 'Sku of the product', required: false })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  sku: string;

  @ApiProperty({ description: 'Brand of the product', required: false })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  brand: string;

  @ApiProperty({ description: 'Color of the product', required: false })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  color: string;

  @ApiProperty({ description: 'Currency of the product', required: false })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  currency: string;

  @ApiProperty({ description: 'Model of the product', required: false })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  model: string;

  @ApiProperty({ description: 'Stock of the product', required: false })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  stock: number;

  @ApiProperty({
    description: 'Whether the product is marked as deleted',
    default: false,
  })
  @IsBoolean()
  @Column({ default: false })
  deleted?: boolean;

  @ApiProperty({ description: 'Date the product was created', required: false })
  @IsDate()
  @CreateDateColumn()
  createdAt?: Date;

  @ApiProperty({
    description: 'Date the product was last updated',
    required: false,
  })
  @IsDate()
  @UpdateDateColumn()
  updatedAt?: Date;
}
