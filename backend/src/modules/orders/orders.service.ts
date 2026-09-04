import { ordersRepository } from "./orders.repository";
import { cartsRepository } from "../carts/carts.repository";
import { productsRepository } from "../products/products.repository";
import { shippingZonesRepository } from "../shipping-zones/shipping-zones.repository";
import { db } from "../../db";
import { products } from "../../db/schema";
import { eq } from "drizzle-orm";

export const ordersService = {
  async getUserOrders(userId: string) {
    const id = Number(userId);
    const userOrders = await ordersRepository.findByUserId(id);
    const result = [];
    for (const order of userOrders) {
      const items = await ordersRepository.findItemsByOrderId(order.id);
      result.push({ ...order, items });
    }
    return result;
  },

  async getById(userId: string, orderId: number, role: string) {
    const order = await ordersRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (role !== "admin" && order.user_id !== Number(userId)) {
      throw new Error("Unauthorized");
    }
    const items = await ordersRepository.findItemsByOrderId(order.id);
    return { ...order, items };
  },

  async createOrder(userId: string, shippingAddress?: string, shippingZoneId?: number) {
    const id = Number(userId);
    const cartItems = await cartsRepository.findByUserId(id);
    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }

    let deliveryFee = 0;
    if (shippingZoneId !== undefined) {
      const zone = await shippingZonesRepository.findById(shippingZoneId);
      if (!zone) {
        throw new Error("Selected shipping zone not found");
      }
      deliveryFee = zone.rate;
    }

    const items = [];
    const stockUpdates = [];
    let total = 0;

    for (const cartItem of cartItems) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, cartItem.product_id))
        .limit(1);

      if (!product) {
        throw new Error(`Product ${cartItem.product_id} not found`);
      }

      if (product.stock < cartItem.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}" (available: ${product.stock}, requested: ${cartItem.quantity})`,
        );
      }

      items.push({
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        price: product.price,
      });

      stockUpdates.push({
        productId: cartItem.product_id,
        newStock: product.stock - cartItem.quantity,
      });

      total += product.price * cartItem.quantity;
    }

    const order = await ordersRepository.create({
      userId: id,
      items,
      totalAmount: total + deliveryFee,
      deliveryFee,
      shippingAddress,
    });

    for (const update of stockUpdates) {
      await productsRepository.updateStock(update.productId, update.newStock);
    }

    await cartsRepository.clearCart(id);

    return order;
  },

  async updatePayment(
    userId: string,
    orderId: number,
    data: { payment_status: string; transaction_ref?: string },
    role: string,
  ) {
    const id = Number(userId);
    const order = await ordersRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (role !== "admin" && order.user_id !== id) {
      throw new Error("Unauthorized");
    }
    return ordersRepository.updatePaymentStatus(
      orderId,
      data.payment_status,
      data.transaction_ref,
    );
  },

  async updateDelivery(
    userId: string,
    orderId: number,
    data: { delivery_status: string },
    role: string,
  ) {
    const id = Number(userId);
    const order = await ordersRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (role !== "admin" && order.user_id !== id) {
      throw new Error("Unauthorized");
    }
    return ordersRepository.updateDeliveryStatus(orderId, data.delivery_status);
  },

  async getAllOrders() {
    const allOrders = await ordersRepository.findAll();
    const result = [];
    for (const order of allOrders) {
      const items = await ordersRepository.findItemsByOrderId(order.id);
      result.push({ ...order, items });
    }
    return result;
  },
};
