import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useDispatch, useSelector } from "react-redux";
import Animated, {
  FadeInDown, FadeInUp, FadeIn,
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "../../../store-config/store";
import type { RootStackParamList, TabParamList } from "../../../navigation/types";
import { useProductsQuery } from "../../Products/hooks/useProducts";
import { useCategoriesQuery } from "../../categories/hooks/useCategories";
import { toggleWishlist } from "../../cart/slice/cartSlice";
import ProductImage from "../../../components/ProductImage";
import { formatPrice } from "../../../lib/format";

const categoryIcons: Record<string, string> = {
  Floral: "flower-outline",
  Woody: "leaf-outline",
  Fresh: "water-outline",
  Oriental: "moon-outline",
};

const categoryColors = ["#f5e6e8", "#e8e0d5", "#d5e8e6", "#e6d5e0"];

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const { data: products = [] } = useProductsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const heroScale = useSharedValue(1);

  const featured = products.slice(0, 5);
  const bestSellers = products.slice(0, 6);

  useEffect(() => {
    heroScale.value = withRepeat(
      withTiming(1.05, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [heroScale]);

  const heroAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.Image
          entering={FadeInUp.duration(500)}
          source={require("../../../../assets/logo/wordmark.png")}
          style={styles.logo}
        />
        <Pressable onPress={() => navigation.navigate("Cart")} style={styles.cartBtn}>
          <Ionicons name="bag-outline" size={22} color="#000" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 99 ? "99+" : cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Animated.Image
            source={{ uri: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800" }}
            style={[styles.heroImage, heroAnimStyle]}
          />
          <Animated.View
            entering={FadeInUp.duration(600).delay(200)}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>Discover Your</Text>
            <Text style={styles.heroTitleBold}>Signature Scent</Text>
            <Text style={styles.heroSub}>Luxury perfumes crafted for every moment</Text>
            <Pressable
              style={styles.heroButton}
              onPress={() => navigation.navigate("Products", undefined)}
            >
              <Text style={styles.heroButtonText}>Shop Now</Text>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <Pressable onPress={() => navigation.navigate("Products", undefined)}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {featured.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.duration(400).delay(index * 100)}
              >
                <Pressable
                  style={styles.featuredCard}
                  onPress={() => navigation.navigate("ProductDetail", { id: String(product.id) })}
                >
                  <ProductImage uri={product.image_url} style={styles.featuredImage} />
                  <Pressable
                    style={styles.favBtn}
                    onPress={() => dispatch(toggleWishlist(product.id))}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons
                      name={wishlist.includes(product.id) ? "heart" : "heart-outline"}
                      size={16}
                      color={wishlist.includes(product.id) ? "#e74c3c" : "#fff"}
                    />
                  </Pressable>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.featuredPrice}>₦{formatPrice(product.price)}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat, index) => (
              <Animated.View
                key={cat.id}
                entering={FadeInUp.duration(400).delay(100 + index * 80)}
                style={{ width: "48%" }}
              >
                <Pressable
                  style={[styles.categoryCard, { backgroundColor: categoryColors[index % categoryColors.length] }]}
                  onPress={() =>
                    navigation.navigate("Products", { categoryId: String(cat.id) })
                  }
                >
                  <Ionicons name={(categoryIcons[cat.name] || "pricetag-outline") as any} size={28} color="#333" />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Sellers</Text>
            <Pressable onPress={() => navigation.navigate("Products", undefined)}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <View style={styles.bestSellersGrid}>
            {bestSellers.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.duration(400).delay(index * 100)}
                style={{ width: "48%" }}
              >
                <Pressable
                  style={styles.bestCard}
                  onPress={() => navigation.navigate("ProductDetail", { id: String(product.id) })}
                >
                  <ProductImage uri={product.image_url} style={styles.bestImage} />
                  <Pressable
                    style={styles.bestFav}
                    onPress={() => dispatch(toggleWishlist(product.id))}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons
                      name={wishlist.includes(product.id) ? "heart" : "heart-outline"}
                      size={15}
                      color={wishlist.includes(product.id) ? "#e74c3c" : "#fff"}
                    />
                  </Pressable>
                  <View style={styles.bestInfo}>
                    <Text style={styles.bestName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.bestPrice}>₦{formatPrice(product.price)}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.brandSection}
        >
          <Animated.Image
            entering={FadeIn.duration(400)}
            source={require("../../../../assets/logo/wordmark.png")}
            style={styles.brandLogo}
          />
          <Text style={styles.brandTagline}>Luxury Perfume House</Text>
          <Text style={styles.brandStory}>
            VelioMart brings you exquisite fragrances, meticulously curated using the finest ingredients from around the world.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "#fff",
  },
  logo: { width: 100, height: 28, resizeMode: "contain" },
  cartBtn: { position: "relative", padding: 4 },
  badge: {
    position: "absolute", top: -4, right: -4,
    backgroundColor: "#e74c3c", borderRadius: 8, minWidth: 16, height: 16,
    justifyContent: "center", alignItems: "center", paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  hero: { height: 420, position: "relative", overflow: "hidden" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 24, paddingBottom: 36, gap: 4,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroTitle: { fontSize: 28, fontWeight: "300", color: "#fff", letterSpacing: 1 },
  heroTitleBold: { fontSize: 32, fontWeight: "800", color: "#fff", letterSpacing: 1 },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  heroButton: {
    alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 24, marginTop: 12,
  },
  heroButtonText: { fontSize: 14, fontWeight: "700", color: "#000" },

  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "500", color: "#888" },

  featuredScroll: { paddingRight: 20, gap: 12 },
  featuredCard: {
    width: 180, borderRadius: 14, overflow: "hidden",
    backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  featuredImage: { width: 180, height: 200, backgroundColor: "#f0f0f0" },
  favBtn: {
    position: "absolute", top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center", alignItems: "center",
  },
  featuredInfo: { padding: 10, gap: 2 },
  featuredName: { fontSize: 14, fontWeight: "600" },
  featuredPrice: { fontSize: 15, fontWeight: "700", color: "#222", marginTop: 2 },

  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: {
    width: "100%", borderRadius: 16, padding: 20, gap: 8,
    alignItems: "center", justifyContent: "center",
  },
  categoryName: { fontSize: 14, fontWeight: "600", color: "#333" },

  bestSellersGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bestCard: {
    width: "100%", borderRadius: 14, overflow: "hidden",
    backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  bestImage: { width: "100%", height: 170, backgroundColor: "#f0f0f0" },
  bestFav: {
    position: "absolute", top: 8, right: 8,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center", alignItems: "center",
  },
  bestInfo: { padding: 10, gap: 2 },
  bestName: { fontSize: 13, fontWeight: "600" },
  bestPrice: { fontSize: 14, fontWeight: "700", color: "#222", marginTop: 2 },

  brandSection: { alignItems: "center", padding: 40, marginTop: 12, gap: 8 },
  brandLogo: { width: 120, height: 34, resizeMode: "contain" },
  brandTagline: { fontSize: 13, color: "#888", letterSpacing: 2 },
  brandStory: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20, marginTop: 4 },
});
