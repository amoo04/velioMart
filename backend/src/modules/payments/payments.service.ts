import { paymentsRepository } from "./payments.repository";
import { ordersRepository } from "../orders/orders.repository";

export const paymentsService = {
  async getUserPayments(userId: string) {
    const id = Number(userId);
    return paymentsRepository.findByUserId(id);
  },

  async getById(userId: string, paymentId: number, role: string) {
    const payment = await paymentsRepository.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (role !== "admin" && payment.user_id !== Number(userId)) {
      throw new Error("Unauthorized");
    }
    return payment;
  },

  async getByOrder(userId: string, orderId: number, role: string) {
    const order = await ordersRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (role !== "admin" && order.user_id !== Number(userId)) {
      throw new Error("Unauthorized");
    }
    return paymentsRepository.findByOrderId(orderId);
  },

  async createPayment(
    userId: string,
    data: { order_id: number; payment_method?: string },
  ) {
    const id = Number(userId);
    const order = await ordersRepository.findById(data.order_id);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.user_id !== id) {
      throw new Error("Unauthorized");
    }
    return paymentsRepository.create({
      userId: id,
      orderId: data.order_id,
      amount: order.total_amount,
      paymentMethod: data.payment_method,
    });
  },

  async updateStatus(
    userId: string,
    paymentId: number,
    data: { payment_status: string; transaction_ref?: string },
    role: string,
  ) {
    const id = Number(userId);
    const payment = await paymentsRepository.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (role !== "admin" && payment.user_id !== id) {
      throw new Error("Unauthorized");
    }
    return paymentsRepository.updateStatus(
      paymentId,
      data.payment_status,
      data.transaction_ref,
    );
  },

  async getAllPayments() {
    return paymentsRepository.findAll();
  },
};
