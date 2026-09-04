import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store-config/store";
import type { RootStackParamList } from "../../../navigation/types";
import { useProductQuery } from "../hooks/useProducts";
import { useAddToCart } from "../../cart/hooks/useUpdateCart";
import { toggleWishlist } from "../../cart/slice/cartSlice";
import ProductImage from "../../../components/ProductImage";
import ReviewsSection from "../../reviews/components/ReviewsSection";
import { formatPrice } from "../../../lib/format";

export default function ProductDetailScreen() {
  const { id } = useRoute<RouteProp<RootStackParamList, "ProductDetail">>().params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const { data: product, isLoading } = useProductQuery(id);
  const addToCart = useAddToCart();

  if (isLoading || !product) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        {isLoading ? <ActivityIndicator size="large" color="#000" /> : <Text>Product not found</Text>}
      </SafeAreaView>
    );
  }

  const isFavorite = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product.id },
      {
        onSuccess: () => navigation.navigate("Tabs", { screen: "Cart" }),
        onError: (err: any) =>
          Alert.alert("Couldn't add to cart", err.message ?? "Something went wrong."),
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Pressable onPress={() => dispatch(toggleWishlist(product.id))}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={26}
            color={isFavorite ? "#e74c3c" : "#000"}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProductImage uri={product.image_url} style={styles.image} iconSize={64} />

        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}

          {product.description && <Text style={styles.description}>{product.description}</Text>}

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.price}>₦{formatPrice(product.price)}</Text>
            <Text style={styles.stock}>
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />
        <ReviewsSection productId={product.id} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.addToCartButton, product.stock <= 0 && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 320,
    backgroundColor: "#f0f0f0",
  },
  details: {
    padding: 20,
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  brand: {
    fontSize: 14,
    color: "#999",
    marginTop: -4,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },
  stock: {
    fontSize: 14,
    color: "#27ae60",
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
  },
  addToCartButtonDisabled: {
    backgroundColor: "#bbb",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
