import {OrderService} from '../services/order.service';
import {
  OrderControllerFetchParams,
  OrderControllerSendParams,
} from '../types/orders-data.types';

export class OrderController {
  constructor(private readonly orderService = new OrderService()) {}

  async fetchOrders(params: OrderControllerFetchParams) {
    return this.orderService.fetchOrders(params);
  }

  async sendOrder(params: OrderControllerSendParams) {
    return this.orderService.sendOrder(params);
  }
}
