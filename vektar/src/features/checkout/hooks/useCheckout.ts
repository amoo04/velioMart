import { useDispatch } from "react-redux";
import { useCreateOrder } from "../../orders/hooks/useUpdateOrders";
import { useCreatePayment } from "../../payments/hooks/useUpdatePayments";
import { setCurrentOrder } from "../slice/checkoutSlice";
import { clearCart } from "../../cart/slice/cartSlice";
import type { AppDispatch } from "../../../store-config/store";

export function usePlaceOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const createOrder = useCreateOrder();
  const createPayment = useCreatePayment();

  const placeOrder = async (params: {
    shipping_address?: string;
    shipping_zone_id?: number;
    payment_method?: string;
  }) => {
    const order = await createOrder.mutateAsync({
      shipping_address: params.shipping_address,
      shipping_zone_id: params.shipping_zone_id,
    });
    await createPayment.mutateAsync({
      order_id: order.id,
      payment_method: params.payment_method,
    });
    dispatch(setCurrentOrder(order));
    dispatch(clearCart());
    return order;
  };

  return {
    placeOrder,
    isPlacing: createOrder.isPending || createPayment.isPending,
    error: createOrder.error?.message ?? createPayment.error?.message ?? null,
  };
}
