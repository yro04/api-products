import { Product } from "../repository/product.entity";

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
