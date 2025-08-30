import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function Profile() {
  const [usernameInput, setUsernameInput] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload photos."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Choose Photo",
      "Select a photo from your gallery or take a new one",
      [
        {
          text: "Camera",
          onPress: takePhoto,
        },
        {
          text: "Gallery",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const removeLocalPhoto = () => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your local photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => ({}),
        },
      ]
    );
  };

  const handleUsernameEdit = () => {};

  const handleUsernameSave = () => {
    const trimmedUsername = usernameInput.trim();
  };

  const handleUsernameCancel = () => {};

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with Avatar */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: "" }} style={styles.avatar} testID="avatar" />
          <TouchableOpacity
            style={styles.photoButton}
            onPress={showImagePickerOptions}
          >
            <Text style={styles.photoButtonText}>📷</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.basicInfo}>
          {/* Username Section */}
          <View style={styles.usernameSection}>
            {isEditingUsername ? (
              <View style={styles.usernameEditContainer}>
                <TextInput
                  style={styles.usernameInput}
                  value={usernameInput}
                  onChangeText={setUsernameInput}
                  placeholder="Enter username"
                  placeholderTextColor="#999"
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.usernameEditButtons}>
                  <TouchableOpacity
                    style={[styles.usernameEditButton, styles.saveButton]}
                    onPress={handleUsernameSave}
                  >
                    <Text style={styles.saveButtonText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.usernameEditButton, styles.cancelButton]}
                    onPress={handleUsernameCancel}
                  >
                    <Text style={styles.cancelButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.usernameDisplayContainer}>
                <Text style={styles.username}>@sample</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleUsernameEdit}
                >
                  <Text style={styles.editButtonText}>✏️</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.name}>Name</Text>
          <Text style={styles.bio}>Bio</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Repositories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Gists</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🏢 Company</Text>
          <Text style={styles.detailValue}>Company</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>📍 Location</Text>
          <Text style={styles.detailValue}>Location</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🌐 Blog</Text>
          <Text style={styles.detailValue}>Blog</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🐦 Twitter</Text>
          <Text style={styles.detailValue}>@twitter</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>📅 Member Since</Text>
          <Text style={styles.detailValue}>0</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🔄 Last Updated</Text>
          <Text style={styles.detailValue}>0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  headerSection: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#007AFF",
  },
  photoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  photoButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff3b30",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  removeButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  basicInfo: {
    alignItems: "center",
    width: "100%",
  },
  usernameSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  usernameDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 16,
  },
  usernameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    maxWidth: 250,
  },
  usernameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#fff",
  },
  usernameEditButtons: {
    flexDirection: "row",
    gap: 4,
  },
  usernameEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#34c759",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  name: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  detailsSection: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  detailValue: {
    fontSize: 16,
    color: "#666",
    flex: 1,
    textAlign: "right",
    marginLeft: 16,
  },
});
