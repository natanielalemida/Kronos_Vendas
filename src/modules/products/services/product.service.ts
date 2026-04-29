import {ProductRepository} from '../repositories/product.repository';
import {ProductDetails, ProductListItem} from '../types/product.types';

export class ProductService {
  constructor(private readonly repository = new ProductRepository()) {}

  async fetchProducts(textFilter?: string): Promise<ProductListItem[]> {
    const result = await this.repository.searchProducts(textFilter);
    return result.data;
  }

  async fetchProductById(productCode: number): Promise<ProductDetails | null> {
    return this.repository.getProductById(productCode);
  }
}
