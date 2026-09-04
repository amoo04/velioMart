import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useNotificationsQuery } from "../hooks/useNotifications";
import {
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "../hooks/useUpdateNotifications";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { data: notifications = [], isLoading: loading } = useNotificationsQuery();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleDelete = (id: number) => {
    Alert.alert("Delete", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNotification.mutate(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <Pressable onPress={() => markAllAsRead.mutate()}>
            <Text style={styles.markAllText}>Mark All Read</Text>
          </Pressable>
        )}
        {unreadCount === 0 && <View style={styles.backBtn} />}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.notif, !item.is_read && styles.notifUnread]}
              onPress={() => !item.is_read && markAsRead.mutate(item.id)}
              onLongPress={() => handleDelete(item.id)}
            >
              <View style={[styles.dot, !item.is_read && styles.dotUnread]} />
              <View style={styles.content}>
                <Text style={[styles.title, !item.is_read && styles.titleUnread]}>{item.title}</Text>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No notifications</Text>
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
  markAllText: { fontSize: 13, fontWeight: "500", color: "#007AFF" },
  list: { paddingVertical: 8 },
  notif: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  notifUnread: { backgroundColor: "#f8f9ff" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "transparent" },
  dotUnread: { backgroundColor: "#007AFF" },
  content: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: "500", color: "#333" },
  titleUnread: { fontWeight: "700" },
  message: { fontSize: 13, color: "#888", lineHeight: 18 },
  date: { fontSize: 11, color: "#bbb", marginTop: 2 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: "#999" },
});
