import { GithubRepoItemProps } from "@/apis/models";
import Divider from "@/components/Divider";
import FilterPopup from "@/components/FilterPopup";
import SearchInput from "@/components/SearchInput";
import UserProfilePopup from "@/components/UserProfilePopup";
import { fetchReposRequest, fetchUserRequest } from "@/redux/slices/repoSlice";
import { RootState } from "@/redux/store";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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
import { useDispatch, useSelector } from "react-redux";
import HomeItem from "./components/HomeItem";

export default function Home() {
  const insets = initialWindowMetrics?.insets ?? useSafeAreaInsets();

  const dispatch = useDispatch();
  const [filterVisible, setFilterVisible] = useState(false);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");
  const {
    repos,
    loading,
    error,
    currentPage,
    hasMore,
    searchQuery,
    sortBy,
    orderBy,
  } = useSelector((state: RootState) => state.repos);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch(fetchReposRequest({ query, page: 1 }));
    },
    [dispatch]
  );

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && searchQuery) {
      dispatch(
        fetchReposRequest({ query: searchQuery, page: currentPage + 1 })
      );
    }
  }, [loading, hasMore, searchQuery, currentPage, dispatch]);

  const handleOwnerPress = useCallback(
    (username: string) => {
      setSelectedUsername(username);
      setUserProfileVisible(true);
      dispatch(fetchUserRequest(username));
    },
    [dispatch]
  );

  const handleUserProfileClose = useCallback(() => {
    setUserProfileVisible(false);
    setSelectedUsername("");
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: GithubRepoItemProps; index: number }) => (
      <HomeItem repo={item} index={index} onOwnerPress={handleOwnerPress} />
    ),
    [handleOwnerPress]
  );

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more repositories...</Text>
      </View>
    );
  }, [loading]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    if (searchQuery?.trim() === "") {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Type anything on search to get started
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error ? `Error: ${error}` : "No repositories found"}
        </Text>
      </View>
    );
  }, [loading, error]);

  const getFilterLabel = () => {
    const sortLabels = {
      stars: "Stars",
      forks: "Forks",
      "help-wanted-issues": "Help Wanted",
      updated: "Recently Updated",
    };
    const orderLabels = {
      asc: "↑",
      desc: "↓",
    };
    return `${sortLabels[sortBy]} ${orderLabels[orderBy]}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <SearchInput onSearch={handleSearch} initialValue={searchQuery} />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterButtonText}>{getFilterLabel()}</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      <FlatList
        data={repos}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(item) => item?.id?.toString()}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
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
