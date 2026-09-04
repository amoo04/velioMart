import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store-config/store";
import type { RootStackParamList } from "../navigation/types";
import type { Product } from "../features/Products/slice/productsSlice";
import { toggleWishlist } from "../features/cart/slice/cartSlice";
import { useAddToCart } from "../features/cart/hooks/useUpdateCart";
import { formatPrice } from "../lib/format";
import ProductImage from "./ProductImage";

interface Props {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const addToCart = useAddToCart();
  const isFavorite = wishlist.includes(product.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <ProductImage uri={product.image_url} style={styles.image} />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => dispatch(toggleWishlist(product.id))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#e74c3c" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>₦{formatPrice(product.price)}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            addToCart.mutate(
              { productId: product.id },
              {
                onSuccess: () => navigation.navigate("Tabs", { screen: "Cart" }),
                onError: (err: any) =>
                  Alert.alert("Couldn't add to cart", err.message ?? "Something went wrong."),
              },
            );
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 6,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: 10,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginTop: 2,
  },
  addButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
