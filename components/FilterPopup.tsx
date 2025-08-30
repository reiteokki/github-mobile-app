import {
  OrderOption,
  setOrderBy,
  setSortBy,
  SortOption,
} from "@/redux/slices/repoSlice";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface FilterPopupProps {
  visible: boolean;
  onClose: () => void;
}

const { height: screenHeight } = Dimensions.get("window");

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  description: string;
}[] = [
  { value: "stars", label: "Stars", description: "Sort by number of stars" },
  { value: "forks", label: "Forks", description: "Sort by number of forks" },
  {
    value: "help-wanted-issues",
    label: "Help Wanted",
    description: "Sort by help wanted issues",
  },
  {
    value: "updated",
    label: "Recently Updated",
    description: "Sort by last updated",
  },
];

const ORDER_OPTIONS: {
  value: OrderOption;
  label: string;
  description: string;
}[] = [
  { value: "desc", label: "Descending", description: "Highest to lowest" },
  { value: "asc", label: "Ascending", description: "Lowest to highest" },
];

export default function FilterPopup({ visible, onClose }: FilterPopupProps) {
  const dispatch = useDispatch();
  const { sortBy, orderBy } = useSelector((state: RootState) => state.repos);

  const [slideAnim] = useState(new Animated.Value(screenHeight));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSortChange = (sort: SortOption) => {
    dispatch(setSortBy(sort));
  };

  const handleOrderChange = (order: OrderOption) => {
    dispatch(setOrderBy(order));
  };

  const renderSortOption = (option: (typeof SORT_OPTIONS)[0]) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.optionItem,
        sortBy === option.value && styles.selectedOption,
      ]}
      onPress={() => handleSortChange(option.value)}
    >
      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionLabel,
            sortBy === option.value && styles.selectedOptionText,
          ]}
        >
          {option.label}
        </Text>
        <Text
          style={[
            styles.optionDescription,
            sortBy === option.value && styles.selectedOptionText,
          ]}
        >
          {option.description}
        </Text>
      </View>
      {sortBy === option.value && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderOrderOption = (option: (typeof ORDER_OPTIONS)[0]) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.optionItem,
        orderBy === option.value && styles.selectedOption,
      ]}
      onPress={() => handleOrderChange(option.value)}
    >
      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionLabel,
            orderBy === option.value && styles.selectedOptionText,
          ]}
        >
          {option.label}
        </Text>
        <Text
          style={[
            styles.optionDescription,
            orderBy === option.value && styles.selectedOptionText,
          ]}
        >
          {option.description}
        </Text>
      </View>
      {orderBy === option.value && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>Filter Repositories</Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              {SORT_OPTIONS.map(renderSortOption)}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order</Text>
              {ORDER_OPTIONS.map(renderOrderOption)}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  popup: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  header: {
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedOption: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  selectedOptionText: {
    color: "#fff",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});
