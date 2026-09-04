import { View, Image, StyleSheet, type ImageStyle, type StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../lib/api";

interface Props {
  uri: string | null | undefined;
  style?: StyleProp<ImageStyle>;
  iconSize?: number;
}

export default function ProductImage({ uri, style, iconSize = 28 }: Props) {
  if (!uri) {
    return (
      <View style={[styles.placeholder, style]}>
        <Ionicons name="image-outline" size={iconSize} color="#ccc" />
      </View>
    );
  }
  const resolvedUri = uri.startsWith("/") ? `${BASE_URL}${uri}` : uri;
  return <Image source={{ uri: resolvedUri }} style={style} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});
