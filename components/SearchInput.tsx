import {
  clearSuggestions,
  fetchSuggestionsRequest,
} from "@/redux/slices/repoSlice";
import { RootState } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function SearchInput({
  onSearch,
  initialValue = "",
}: SearchInputProps) {
  const [searchText, setSearchText] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const dispatch = useDispatch();

  const { suggestions, suggestionsLoading } = useSelector(
    (state: RootState) => state.repos
  );

  useEffect(() => {
    if (searchText.length >= 2 && showSuggestions) {
      dispatch(fetchSuggestionsRequest(searchText));
    } else if (searchText.length < 2) {
      dispatch(clearSuggestions());
    }
  }, [searchText, showSuggestions, dispatch]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setShowSuggestions(true);
  };

  const handleSearch = (query: string) => {
    setSearchText(query);
    setShowSuggestions(false);
    onSearch(query);
    dispatch(clearSuggestions());
    Keyboard.dismiss();
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleInputFocus = () => {
    if (searchText.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleOutsidePress = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleTextChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Search repositories..."
            placeholderTextColor="#999"
            onSubmitEditing={() => handleSearch(searchText)}
            returnKeyType="search"
          />
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestionsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Loading suggestions...</Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                renderItem={renderSuggestion}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              />
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    zIndex: 1000,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
});
