import "@testing-library/jest-native/extend-expect";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  useSegments: () => [],
  useRootNavigationState: () => ({ key: "test" }),
  useRootNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  Link: "Link",
  Stack: {
    Screen: "Stack.Screen",
  },
  Tabs: {
    Screen: "Tabs.Screen",
  },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

jest.mock("expo-linking", () => ({
  openURL: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("redux-persist", () => ({
  persistStore: jest.fn(),
  persistReducer: jest.fn((config, reducer) => reducer),
}));

jest.mock("redux-persist/integration/react", () => ({
  PersistGate: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("react-native-gesture-handler", () => {});

jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      apiUrl: "https://api.github.com",
    },
  },
}));

global.console = {
  ...console,
};
