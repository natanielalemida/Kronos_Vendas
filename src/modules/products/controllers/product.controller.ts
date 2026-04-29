import {ProductService} from '../services/product.service';

export class ProductController {
  constructor(private readonly service = new ProductService()) {}

  async fetchProducts(textFilter?: string) {
    return this.service.fetchProducts(textFilter);
  }

  async fetchProductById(productCode: number) {
    return this.service.fetchProductById(productCode);
  }
}
