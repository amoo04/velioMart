import { View, Text, StyleSheet } from "react-native";

const trackingSteps = [
  { key: "processing", label: "Order Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const statusOrder = ["processing", "shipped", "out_for_delivery", "delivered"];

export default function OrderTrackingTimeline({ status }: { status: string }) {
  const currentStepIndex = statusOrder.indexOf(status);

  return (
    <View style={styles.trackingSection}>
      <Text style={styles.sectionTitle}>Tracking</Text>
      <View style={styles.timeline}>
        {trackingSteps.map((step, index) => {
          const stepIndex = statusOrder.indexOf(step.key);
          const isCompleted = currentStepIndex >= stepIndex;
          const isCurrent = currentStepIndex === stepIndex;

          return (
            <View key={step.key} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.dot,
                    isCompleted ? styles.dotCompleted : styles.dotPending,
                    isCurrent && styles.dotCurrent,
                  ]}
                />
                {index < trackingSteps.length - 1 && (
                  <View
                    style={[styles.line, isCompleted ? styles.lineCompleted : styles.linePending]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.timelineLabel,
                  isCompleted ? styles.timelineLabelActive : styles.timelineLabelInactive,
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trackingSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineLeft: {
    alignItems: "center",
    width: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  dotCompleted: {
    backgroundColor: "#000",
  },
  dotPending: {
    backgroundColor: "#ddd",
  },
  dotCurrent: {
    backgroundColor: "#007AFF",
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 2,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 28,
  },
  lineCompleted: {
    backgroundColor: "#000",
  },
  linePending: {
    backgroundColor: "#ddd",
  },
  timelineLabel: {
    fontSize: 14,
    paddingBottom: 20,
    flex: 1,
  },
  timelineLabelActive: {
    color: "#000",
    fontWeight: "500",
  },
  timelineLabelInactive: {
    color: "#bbb",
  },
});
