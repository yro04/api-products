import { ProductRepository } from '../repository/product.entity';

export interface PaginatedProducts {
  items: ProductRepository[];
  total: number;
  page: number;
  pageSize: number;
}
