import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomeItemProps {
  index: number;
  onOwnerPress: (username: string) => void;
}

export default function HomeItem({ index, onOwnerPress }: HomeItemProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.index}>{index + 1}.</Text>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.repoName}>Name</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>⭐ 0</Text>
            <Text style={styles.stat}>🍴 {formatNumber(0)}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          Description
        </Text>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              onOwnerPress("");
            }}
          >
            <Text style={styles.owner}>👤 Owner</Text>
          </TouchableOpacity>

          <Text style={styles.language}>💻 Language</Text>

          <Text style={styles.updated}>📅 Date</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  index: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    minWidth: 30,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  repoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  stats: {
    flexDirection: "row",
    gap: 8,
  },
  stat: {
    fontSize: 12,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  owner: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  language: {
    fontSize: 12,
    color: "#666",
  },
  updated: {
    fontSize: 12,
    color: "#666",
  },
});
