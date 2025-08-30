import Divider from "@/components/Divider";
import FilterPopup from "@/components/FilterPopup";
import SearchInput from "@/components/SearchInput";
import UserProfilePopup from "@/components/UserProfilePopup";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import HomeItem from "./components/HomeItem";

export default function Home() {
  const insets = initialWindowMetrics?.insets ?? useSafeAreaInsets();

  const [filterVisible, setFilterVisible] = useState(false);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");

  const handleOwnerPress = useCallback((username: string) => {
    setSelectedUsername(username);
    setUserProfileVisible(true);
  }, []);

  const handleUserProfileClose = useCallback(() => {
    setUserProfileVisible(false);
    setSelectedUsername("");
  }, []);

  const renderItem = useCallback(
    ({ index }: { index: number }) => (
      <HomeItem index={index} onOwnerPress={handleOwnerPress} />
    ),
    [handleOwnerPress]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <SearchInput onSearch={() => {}} initialValue={""} />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(item, index) => index?.toString()}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />

      <FilterPopup
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />

      <UserProfilePopup
        visible={userProfileVisible}
        onClose={handleUserProfileClose}
        username={selectedUsername}
      />
    </View>
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
    paddingRight: 16,
  },
  filterButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  footerLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
