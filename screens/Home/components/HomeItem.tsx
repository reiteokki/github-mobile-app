import { GithubRepoItemProps } from "@/apis/models";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomeItemProps {
  repo: GithubRepoItemProps;
  index: number;
  onOwnerPress: (username: string) => void;
}

export default function HomeItem({ repo, index, onOwnerPress }: HomeItemProps) {
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
          <Text style={styles.repoName}>{repo.name}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>
              ⭐{" "}
              {repo.stargazers_count ? formatNumber(repo.stargazers_count) : 0}
            </Text>
            <Text style={styles.stat}>
              🍴 {repo.forks_count ? formatNumber(repo.forks_count) : 0}
            </Text>
          </View>
        </View>

        {repo.description && (
          <Text style={styles.description} numberOfLines={2}>
            {repo.description}
          </Text>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              {
                repo?.owner?.login ? onOwnerPress(repo.owner.login) : null;
              }
            }}
          >
            <Text style={styles.owner}>👤 {repo?.owner?.login}</Text>
          </TouchableOpacity>

          {repo.language && (
            <Text style={styles.language}>💻 {repo.language}</Text>
          )}

          <Text style={styles.updated}>
            📅{" "}
            {repo.updated_at
              ? new Date(repo.updated_at).toLocaleDateString()
              : ""}
          </Text>
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
