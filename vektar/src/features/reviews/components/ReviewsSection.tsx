import { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProductReviewsQuery, useCreateReview } from "../hooks/useReviews";
import { useAuth } from "../../../lib/auth-context";

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={size}
          color="#f5a623"
        />
      ))}
    </View>
  );
}

export default function ReviewsSection({ productId }: { productId: number }) {
  const { isAuthenticated } = useAuth();
  const { data: reviews = [], isLoading } = useProductReviewsQuery(productId);
  const createReview = useCreateReview();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Add a rating", "Tap a star to rate this product.");
      return;
    }
    createReview.mutate(
      { productId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setShowForm(false);
          setRating(0);
          setComment("");
          Alert.alert("Thank you!", "Your review has been submitted and is awaiting approval.");
        },
        onError: (err) => Alert.alert("Couldn't submit review", err.message),
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Reviews {reviews.length > 0 ? `(${reviews.length})` : ""}</Text>
        {isAuthenticated && !showForm && (
          <Pressable onPress={() => setShowForm(true)}>
            <Text style={styles.writeLink}>Write a review</Text>
          </Pressable>
        )}
      </View>

      {reviews.length > 0 && (
        <View style={styles.averageRow}>
          <Stars rating={Math.round(averageRating)} size={18} />
          <Text style={styles.averageText}>{averageRating.toFixed(1)} out of 5</Text>
        </View>
      )}

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formLabel}>Your rating</Text>
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)}>
                <Ionicons name={n <= rating ? "star" : "star-outline"} size={28} color="#f5a623" />
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Share your thoughts (optional)"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Pressable style={styles.cancelButton} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.submitButton, createReview.isPending && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={createReview.isPending}
            >
              {createReview.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator color="#000" style={{ marginTop: 12 }} />
      ) : reviews.length === 0 ? (
        <Text style={styles.empty}>No reviews yet. Be the first to review this product.</Text>
      ) : (
        <View style={{ gap: 16, marginTop: 12 }}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewRow}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{review.customer_name}</Text>
                <Stars rating={review.rating} />
              </View>
              {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 17, fontWeight: "700" },
  writeLink: { fontSize: 14, fontWeight: "600", color: "#007AFF" },
  averageRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  averageText: { fontSize: 14, color: "#666" },
  empty: { fontSize: 14, color: "#999", marginTop: 12 },
  form: {
    marginTop: 14, padding: 14, borderRadius: 12, backgroundColor: "#f8f8f8",
  },
  formLabel: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12,
    fontSize: 14, backgroundColor: "#fff", minHeight: 70, textAlignVertical: "top",
  },
  cancelButton: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center",
    borderWidth: 1, borderColor: "#ddd",
  },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#555" },
  submitButton: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center", backgroundColor: "#000",
  },
  submitText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  reviewRow: { borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 12 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewerName: { fontSize: 14, fontWeight: "600", color: "#333" },
  reviewComment: { fontSize: 14, color: "#555", marginTop: 6, lineHeight: 20 },
});
