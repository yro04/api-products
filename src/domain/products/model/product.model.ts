export interface Product {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

export interface GetProductsParams {
  page?: number;
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
