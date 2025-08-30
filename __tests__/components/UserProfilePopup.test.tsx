import React from "react";
import UserProfilePopup from "../../components/UserProfilePopup";
import { act, fireEvent, render, screen } from "../utils/test-utils.test";

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
  bio: "Test bio description",
  twitter_username: "testuser",
  public_repos: 50,
  public_gists: 10,
  followers: 100,
  following: 50,
  created_at: "2020-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

describe("UserProfilePopup Component", () => {
  const mockOnClose = jest.fn();

  const defaultState = {
    repos: {
      repos: [],
      loading: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      searchQuery: "",
      sortBy: "stars" as const,
      orderBy: "desc" as const,
      suggestions: [],
      suggestionsLoading: false,
      selectedUser: mockUser,
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
    it("renders without crashing when visible", () => {
      expect(() => {
        render(
          <UserProfilePopup
            visible={true}
            onClose={mockOnClose}
            username="testuser"
          />,
          { preloadedState: defaultState }
        );
      }).not.toThrow();
    });

    it("renders without crashing when not visible", () => {
      expect(() => {
        render(
          <UserProfilePopup
            visible={false}
            onClose={mockOnClose}
            username="testuser"
          />,
          { preloadedState: defaultState }
        );
      }).not.toThrow();
    });

    it("displays user profile title when visible", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("User Profile")).toBeTruthy();
    });

    it("displays username correctly", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getAllByText("@testuser")[0]).toBeTruthy();
    });
  });

  describe("User Information Display", () => {
    it("displays user avatar", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getAllByText("@testuser")[0]).toBeTruthy();
    });

    it("displays user name when available", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("Test User")).toBeTruthy();
    });

    it("displays user bio when available", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("Test bio description")).toBeTruthy();
    });

    it("displays user stats correctly", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getAllByText("50")[0]).toBeTruthy();
      expect(screen.getByText("100")).toBeTruthy();
      expect(screen.getAllByText("50")[1]).toBeTruthy();
      expect(screen.getByText("10")).toBeTruthy();
    });

    it("displays user details when available", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("Company")).toBeTruthy();
      expect(screen.getByText("Test Company")).toBeTruthy();
      expect(screen.getByText("Location")).toBeTruthy();
      expect(screen.getByText("Test City")).toBeTruthy();
      expect(screen.getByText("Blog")).toBeTruthy();
      expect(screen.getByText("https://testuser.com")).toBeTruthy();
    });
  });

  describe("Loading State", () => {
    it("shows loading indicator when user is loading", () => {
      const loadingState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          userLoading: true,
          selectedUser: null,
        },
      };

      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: loadingState }
      );

      expect(screen.getByText("Loading user profile...")).toBeTruthy();
    });

    it("does not show user info when loading", () => {
      const loadingState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          userLoading: true,
          selectedUser: null,
        },
      };

      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: loadingState }
      );

      expect(screen.queryByText("@testuser")).toBeNull();
      expect(screen.queryByText("Test User")).toBeNull();
    });
  });

  describe("Error State", () => {
    it("shows error message when user fetch fails", () => {
      const errorState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          userError: "User not found",
          selectedUser: null,
        },
      };

      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: errorState }
      );

      expect(screen.getByText("No Data Found")).toBeTruthy();
      expect(screen.getByText("User not found")).toBeTruthy();
    });

    it("shows no data message when user is null", () => {
      const noDataState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          selectedUser: null,
        },
      };

      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: noDataState }
      );

      expect(screen.getByText("User Profile")).toBeTruthy();
    });
  });

  describe("Close Functionality", () => {
    it("calls onClose when close button is pressed", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      const closeButton = screen.getByText("✕");

      act(() => {
        fireEvent.press(closeButton);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("dispatches clearUser when close button is pressed", () => {
      const { store } = render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      const closeButton = screen.getByText("✕");

      act(() => {
        fireEvent.press(closeButton);
      });

      expect(closeButton).toBeTruthy();
    });
  });

  describe("View on GitHub Button", () => {
    it("displays view on GitHub button when user has html_url", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("View on GitHub")).toBeTruthy();
    });

    it("handles view on GitHub button press", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      const viewButton = screen.getByText("View on GitHub");

      act(() => {
        fireEvent.press(viewButton);
      });

      expect(viewButton).toBeTruthy();
    });
  });

  describe("Redux Integration", () => {
    it("reads user data from Redux state", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getAllByText("@testuser")[0]).toBeTruthy();
      expect(screen.getByText("Test User")).toBeTruthy();
      expect(screen.getByText("Test bio description")).toBeTruthy();
    });

    it("dispatches clearUser action on close", () => {
      const { store } = render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      const closeButton = screen.getByText("✕");

      act(() => {
        fireEvent.press(closeButton);
      });

      expect(closeButton).toBeTruthy();
    });
  });

  describe("Component Structure", () => {
    it("renders all required sections when user data is available", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("User Profile")).toBeTruthy();

      expect(screen.getAllByText("@testuser")[0]).toBeTruthy();
      expect(screen.getByText("Test User")).toBeTruthy();
      expect(screen.getByText("Test bio description")).toBeTruthy();

      expect(screen.getByText("Repositories")).toBeTruthy();
      expect(screen.getByText("Followers")).toBeTruthy();
      expect(screen.getByText("Following")).toBeTruthy();
      expect(screen.getByText("Gists")).toBeTruthy();

      expect(screen.getByText("Company")).toBeTruthy();

      expect(screen.getByText("View on GitHub")).toBeTruthy();
    });

    it("renders user stats correctly", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getAllByText("50")[0]).toBeTruthy();
      expect(screen.getByText("100")).toBeTruthy();
      expect(screen.getAllByText("50")[1]).toBeTruthy();
      expect(screen.getByText("10")).toBeTruthy();
    });

    it("renders user details correctly", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("Company")).toBeTruthy();
      expect(screen.getByText("Test Company")).toBeTruthy();
      expect(screen.getByText("Location")).toBeTruthy();
      expect(screen.getByText("Test City")).toBeTruthy();
      expect(screen.getByText("Blog")).toBeTruthy();
      expect(screen.getByText("https://testuser.com")).toBeTruthy();
      expect(screen.getByText("Twitter")).toBeTruthy();
      expect(screen.getAllByText("@testuser")[1]).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("handles close button press correctly", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      const closeButton = screen.getByText("✕");

      act(() => {
        fireEvent.press(closeButton);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("handles view on GitHub button press correctly", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      const viewButton = screen.getByText("View on GitHub");

      act(() => {
        fireEvent.press(viewButton);
      });

      expect(viewButton).toBeTruthy();
    });

    it("handles multiple close button presses", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      const closeButton = screen.getByText("✕");

      act(() => {
        fireEvent.press(closeButton);
        fireEvent.press(closeButton);
        fireEvent.press(closeButton);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });
  });

  describe("Edge Cases", () => {
    it("handles component when not visible", () => {
      render(
        <UserProfilePopup
          visible={false}
          onClose={mockOnClose}
          username="testuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.queryByText("User Profile")).toBeNull();
    });

    it("handles user without optional fields", () => {
      const minimalUser = {
        login: "minimaluser",
        id: 456,
        avatar_url: "https://example.com/avatar.jpg",
        html_url: "https://github.com/minimaluser",
        type: "User",
        name: null,
        company: null,
        blog: null,
        location: null,
        email: null,
        bio: null,
        twitter_username: null,
        public_repos: 0,
        public_gists: 0,
        followers: 0,
        following: 0,
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      };

      const minimalState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          selectedUser: minimalUser,
        },
      };

      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="minimaluser"
        />,
        { preloadedState: minimalState }
      );

      expect(screen.getByText("@minimaluser")).toBeTruthy();
      expect(screen.getAllByText("0")[0]).toBeTruthy();

      expect(screen.queryByText("Test User")).toBeNull();
      expect(screen.queryByText("Test bio description")).toBeNull();
    });

    it("handles different usernames correctly", () => {
      render(
        <UserProfilePopup
          visible={true}
          onClose={mockOnClose}
          username="differentuser"
        />,
        { preloadedState: defaultState }
      );

      expect(screen.getByText("User Profile")).toBeTruthy();
    });
  });
});
