import { configureStore } from "@reduxjs/toolkit";
import { render, RenderOptions } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import profileReducer from "../../redux/slices/profileSlice";
import repoReducer from "../../redux/slices/repoSlice";

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      repos: repoReducer,
      profile: profileReducer,
    },
    preloadedState,
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

const customRender = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

describe("Test Utilities", () => {
  it("should create a test store with default state", () => {
    const store = createTestStore();
    const state = store.getState();

    expect(state).toHaveProperty("repos");
    expect(state).toHaveProperty("profile");
    expect(state.profile.currentUsername).toBe("octocat");
  });

  it("should create a test store with preloaded state", () => {
    const preloadedState = {
      profile: {
        currentUsername: "testuser",
        localPhotoUri: null,
      },
    };

    const store = createTestStore(preloadedState);
    const state = store.getState();

    expect(state.profile.currentUsername).toBe("testuser");
  });

  it("should render components with Redux provider", () => {
    const TestComponent = () => (
      <View>
        <Text>Test</Text>
      </View>
    );
    const { getByText } = customRender(<TestComponent />);

    expect(getByText("Test")).toBeTruthy();
  });

  it("should provide store access in render result", () => {
    const TestComponent = () => (
      <View>
        <Text>Test</Text>
      </View>
    );
    const { store } = customRender(<TestComponent />);

    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe("function");
    expect(typeof store.getState).toBe("function");
  });
});

export * from "@testing-library/react-native";
export { createTestStore, customRender as render };

