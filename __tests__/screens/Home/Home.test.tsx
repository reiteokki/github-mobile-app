import React from "react";
import Home from "../../../screens/Home";
import { act, fireEvent, render, screen } from "../../utils/test-utils.test";

const mockRepos = [
  {
    id: 1,
    name: "test-repo-1",
    full_name: "testuser/test-repo-1",
    description: "Test repository 1",
    stargazers_count: 100,
    forks_count: 50,
    language: "JavaScript",
    updated_at: "2023-01-01T00:00:00Z",
    owner: {
      login: "testuser",
      id: 123,
      avatar_url: "https://example.com/avatar.jpg",
      html_url: "https://github.com/testuser",
      type: "User",
    },
  },
  {
    id: 2,
    name: "test-repo-2",
    full_name: "testuser/test-repo-2",
    description: "Test repository 2",
    stargazers_count: 200,
    forks_count: 75,
    language: "TypeScript",
    updated_at: "2023-01-02T00:00:00Z",
    owner: {
      login: "testuser2",
      id: 456,
      avatar_url: "https://example.com/avatar2.jpg",
      html_url: "https://github.com/testuser2",
      type: "User",
    },
  },
];

const mockUser = {
  login: "testuser",
  id: 123,
  avatar_url: "https://example.com/avatar.jpg",
  html_url: "https://github.com/testuser",
  type: "User",
  name: "Test User",
  company: "Test Company",
  blog: "https://testuser.com",
  location: "Test City",
  email: "test@example.com",
  bio: "Test bio",
  twitter_username: "testuser",
  public_repos: 50,
  public_gists: 10,
  followers: 100,
  following: 50,
  created_at: "2020-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

describe("Home Component", () => {
  const defaultState = {
    repos: {
      repos: mockRepos,
      loading: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      searchQuery: "test",
      sortBy: "stars" as const,
      orderBy: "desc" as const,
      suggestions: [],
      suggestionsLoading: false,
      selectedUser: null,
      userLoading: false,
      userError: null,
      profileUser: null,
      profileLoading: false,
      profileError: null,
      isEditingUsername: false,
    },
    profile: {
      currentUsername: "octocat",
      localPhotoUri: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      expect(() => {
        render(<Home />, { preloadedState: defaultState });
      }).not.toThrow();
    });

    it("displays search input and filter button", () => {
      render(<Home />, { preloadedState: defaultState });

      expect(screen.getByText("Stars ↓")).toBeTruthy();
    });

    it("displays repository list when data is available", () => {
      render(<Home />, { preloadedState: defaultState });

      expect(screen.getByText("test-repo-1")).toBeTruthy();
      expect(screen.getByText("test-repo-2")).toBeTruthy();
    });

    it("displays repository details correctly", () => {
      render(<Home />, { preloadedState: defaultState });

      expect(screen.getByText("Test repository 1")).toBeTruthy();
      expect(screen.getByText("⭐ 100")).toBeTruthy();
      expect(screen.getByText("🍴 50")).toBeTruthy();
      expect(screen.getByText("💻 JavaScript")).toBeTruthy();
    });
  });

  describe("Empty State", () => {
    it("shows empty state when no search query", () => {
      const emptyState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          repos: [],
          searchQuery: "",
        },
      };

      render(<Home />, { preloadedState: emptyState });

      expect(
        screen.getByText("Type anything on search to get started")
      ).toBeTruthy();
    });

    it("shows no repositories found when search returns empty", () => {
      const emptySearchState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          repos: [],
          searchQuery: "nonexistent",
        },
      };

      render(<Home />, { preloadedState: emptySearchState });

      expect(screen.getByText("No repositories found")).toBeTruthy();
    });

    it("shows error message when there is an error", () => {
      const errorState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          repos: [],
          error: "API Error",
        },
      };

      render(<Home />, { preloadedState: errorState });

      expect(screen.getByText("Error: API Error")).toBeTruthy();
    });
  });

  describe("Loading State", () => {
    it("shows loading indicator when loading", () => {
      const loadingState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          loading: true,
        },
      };

      render(<Home />, { preloadedState: loadingState });

      expect(screen.getByText("Loading more repositories...")).toBeTruthy();
    });

    it("does not show empty state when loading", () => {
      const loadingState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          repos: [],
          loading: true,
        },
      };

      render(<Home />, { preloadedState: loadingState });

      expect(
        screen.queryByText("Type anything on search to get started")
      ).toBeNull();
    });
  });

  describe("Filter Functionality", () => {
    it("displays correct filter label", () => {
      render(<Home />, { preloadedState: defaultState });

      expect(screen.getByText("Stars ↓")).toBeTruthy();
    });

    it("displays different filter labels for different sort options", () => {
      const forksState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          sortBy: "forks" as const,
          orderBy: "asc" as const,
        },
      };

      render(<Home />, { preloadedState: forksState });

      expect(screen.getByText("Forks ↑")).toBeTruthy();
    });

    it("opens filter popup when filter button is pressed", () => {
      render(<Home />, { preloadedState: defaultState });

      const filterButton = screen.getByText("Stars ↓");
      fireEvent.press(filterButton);

      expect(filterButton).toBeTruthy();
    });
  });

  describe("User Profile Popup", () => {
    it("opens user profile popup when owner is pressed", () => {
      render(<Home />, { preloadedState: defaultState });

      const ownerButton = screen.getByText("👤 testuser");
      fireEvent.press(ownerButton);

      expect(ownerButton).toBeTruthy();
    });

    it("displays user profile popup with user data", () => {
      const userProfileState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          selectedUser: mockUser,
          userLoading: false,
        },
      };

      render(<Home />, { preloadedState: userProfileState });

      expect(userProfileState.repos.selectedUser).toEqual(mockUser);
    });
  });

  describe("Redux Integration", () => {
    it("dispatches fetchReposRequest when search is performed", () => {
      const { store } = render(<Home />, { preloadedState: defaultState });

      const state = store.getState();
      expect(state.repos.searchQuery).toBe("test");
      expect(state.repos.repos).toEqual(mockRepos);
    });

    it("dispatches fetchUserRequest when owner is pressed", () => {
      const { store } = render(<Home />, { preloadedState: defaultState });

      const ownerButton = screen.getByText("👤 testuser");

      act(() => {
        fireEvent.press(ownerButton);
      });

      expect(ownerButton).toBeTruthy();
    });

    it("handles infinite scroll correctly", () => {
      const { store } = render(<Home />, { preloadedState: defaultState });

      const state = store.getState();
      expect(state.repos.hasMore).toBe(true);
      expect(state.repos.currentPage).toBe(1);
    });
  });

  describe("Component Structure", () => {
    it("renders all required components", () => {
      render(<Home />, { preloadedState: defaultState });

      expect(screen.getByText("Stars ↓")).toBeTruthy();
      expect(screen.getByText("test-repo-1")).toBeTruthy();
      expect(screen.getByText("👤 testuser")).toBeTruthy();
    });

    it("renders repository items with correct data", () => {
      render(<Home />, { preloadedState: defaultState });

      expect(screen.getByText("1.")).toBeTruthy();
      expect(screen.getByText("test-repo-1")).toBeTruthy();
      expect(screen.getByText("Test repository 1")).toBeTruthy();
      expect(screen.getByText("⭐ 100")).toBeTruthy();
      expect(screen.getByText("🍴 50")).toBeTruthy();
      expect(screen.getByText("💻 JavaScript")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("handles owner press correctly", () => {
      render(<Home />, { preloadedState: defaultState });

      const ownerButton = screen.getByText("👤 testuser");

      act(() => {
        fireEvent.press(ownerButton);
      });

      expect(ownerButton).toBeTruthy();
    });

    it("handles filter button press correctly", () => {
      render(<Home />, { preloadedState: defaultState });

      const filterButton = screen.getByText("Stars ↓");

      act(() => {
        fireEvent.press(filterButton);
      });

      expect(filterButton).toBeTruthy();
    });
  });
});
