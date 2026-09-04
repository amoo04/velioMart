import { db } from "../../db";
import { orders, orderItems, cart, products, users } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export type CreateOrderItemInput = {
  productId: number;
  quantity: number;
  price: number;
};

export type CreateOrderInput = {
  userId: number;
  items: CreateOrderItemInput[];
  totalAmount: number;
  deliveryFee?: number;
  shippingAddress?: string;
};

function generateOrderCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `ORD-${code}`;
}

export const ordersRepository = {
  async findByUserId(userId: number) {
    try {
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.user_id, userId));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db
        .select({
          id: orders.id,
          order_code: orders.order_code,
          user_id: orders.user_id,
          customer_email: users.email,
          customer_name: users.name,
          customer_phone: users.phone,
          total_amount: orders.total_amount,
          delivery_fee: orders.delivery_fee,
          payment_status: orders.payment_status,
          delivery_status: orders.delivery_status,
          transaction_ref: orders.transaction_ref,
          shipping_address: orders.shipping_address,
          created_at: orders.created_at,
          updated_at: orders.updated_at,
        })
        .from(orders)
        .leftJoin(users, eq(orders.user_id, users.id))
        .where(eq(orders.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error}`);
    }
  },

  async findItemsByOrderId(orderId: number) {
    try {
      const result = await db
        .select({
          id: orderItems.id,
          order_id: orderItems.order_id,
          product_id: orderItems.product_id,
          quantity: orderItems.quantity,
          price: orderItems.price,
          product_name: products.name,
          product_image_url: products.image_url,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.product_id, products.id))
        .where(eq(orderItems.order_id, orderId));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch order items: ${error}`);
    }
  },

  async create(data: CreateOrderInput) {
    try {
      const [order] = await db
        .insert(orders)
        .values({
          order_code: generateOrderCode(),
          user_id: data.userId,
          total_amount: data.totalAmount,
          delivery_fee: data.deliveryFee ?? 0,
          shipping_address: data.shippingAddress ?? null,
        })
        .returning();

      if (data.items.length > 0) {
        await db.insert(orderItems).values(
          data.items.map((item) => ({
            order_id: order.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        );
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.order_id, order.id));

      return { ...order, items };
    } catch (error) {
      throw new Error(`Failed to create order: ${error}`);
    }
  },

  async updatePaymentStatus(
    id: number,
    paymentStatus: string,
    transactionRef?: string,
  ) {
    try {
      const values: Record<string, any> = {
        payment_status: paymentStatus,
      };
      if (transactionRef !== undefined) {
        values.transaction_ref = transactionRef;
      }
      const result = await db
        .update(orders)
        .set(values)
        .where(eq(orders.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error}`);
    }
  },

  async updateDeliveryStatus(id: number, deliveryStatus: string) {
    try {
      const result = await db
        .update(orders)
        .set({ delivery_status: deliveryStatus })
        .where(eq(orders.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update delivery status: ${error}`);
    }
  },

  async findAll() {
    try {
      const result = await db
        .select({
          id: orders.id,
          order_code: orders.order_code,
          user_id: orders.user_id,
          customer_email: users.email,
          customer_name: users.name,
          total_amount: orders.total_amount,
          delivery_fee: orders.delivery_fee,
          payment_status: orders.payment_status,
          delivery_status: orders.delivery_status,
          transaction_ref: orders.transaction_ref,
          shipping_address: orders.shipping_address,
          created_at: orders.created_at,
          updated_at: orders.updated_at,
        })
        .from(orders)
        .leftJoin(users, eq(orders.user_id, users.id))
        .orderBy(desc(orders.created_at));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch all orders: ${error}`);
    }
  },
};
