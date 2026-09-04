import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { useCategoriesQuery } from "../hooks/useCategories";

export default function CategoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: categories = [], isLoading: loading } = useCategoriesQuery();

  const iconMap: Record<string, string> = {
    Floral: "flower-outline",
    Woody: "leaf-outline",
    Fresh: "water-outline",
    Oriental: "moon-outline",
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("Tabs", { screen: "Products", params: { categoryId: String(item.id) } })
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons name={(iconMap[item.name] || "grid-outline") as any} size={28} color="#333" />
              </View>
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="grid-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No categories found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 12, paddingVertical: 14,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  list: { padding: 12 },
  row: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 20,
    alignItems: "center", gap: 6,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#f5f5f5",
    justifyContent: "center", alignItems: "center",
  },
  name: { fontSize: 15, fontWeight: "600", textAlign: "center" },
  count: { fontSize: 12, color: "#888" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: "#999" },
});
