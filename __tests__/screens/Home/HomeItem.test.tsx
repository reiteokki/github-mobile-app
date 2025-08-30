import React from "react";
import HomeItem from "../../../screens/Home/components/HomeItem";
import { act, fireEvent, render, screen } from "../../utils/test-utils.test";

const mockRepo = {
  id: 1,
  name: "test-repo",
  full_name: "testuser/test-repo",
  description:
    "This is a test repository with a long description that should be truncated",
  stargazers_count: 1500,
  forks_count: 250,
  language: "JavaScript",
  updated_at: "2023-01-15T00:00:00Z",
  owner: {
    login: "testuser",
    id: 123,
    avatar_url: "https://example.com/avatar.jpg",
    html_url: "https://github.com/testuser",
    type: "User",
  },
};

const mockRepoWithoutDescription = {
  ...mockRepo,
  description: null,
};

const mockRepoWithoutLanguage = {
  ...mockRepo,
  language: null,
};

describe("HomeItem Component", () => {
  const mockOnOwnerPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      expect(() => {
        render(
          <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
        );
      }).not.toThrow();
    });

    it("displays repository name correctly", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("test-repo")).toBeTruthy();
    });

    it("displays index number correctly", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("1.")).toBeTruthy();
    });

    it("displays index number correctly for different indices", () => {
      render(
        <HomeItem repo={mockRepo} index={5} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("6.")).toBeTruthy();
    });
  });

  describe("Repository Details", () => {
    it("displays repository description when available", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(
        screen.getByText(
          "This is a test repository with a long description that should be truncated"
        )
      ).toBeTruthy();
    });

    it("does not display description when null", () => {
      render(
        <HomeItem
          repo={mockRepoWithoutDescription}
          index={0}
          onOwnerPress={mockOnOwnerPress}
        />
      );

      expect(
        screen.queryByText(
          "This is a test repository with a long description that should be truncated"
        )
      ).toBeNull();
    });

    it("displays language when available", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("💻 JavaScript")).toBeTruthy();
    });

    it("does not display language when null", () => {
      render(
        <HomeItem
          repo={mockRepoWithoutLanguage}
          index={0}
          onOwnerPress={mockOnOwnerPress}
        />
      );

      expect(screen.queryByText("💻 JavaScript")).toBeNull();
    });
  });

  describe("Statistics Display", () => {
    it("displays star count correctly", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("⭐ 1.5k")).toBeTruthy();
    });

    it("displays fork count correctly", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("🍴 250")).toBeTruthy();
    });

    it("formats large numbers correctly", () => {
      const largeRepo = {
        ...mockRepo,
        stargazers_count: 15000,
        forks_count: 5000,
      };

      render(
        <HomeItem repo={largeRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("⭐ 15.0k")).toBeTruthy();
      expect(screen.getByText("🍴 5.0k")).toBeTruthy();
    });

    it("formats small numbers correctly", () => {
      const smallRepo = {
        ...mockRepo,
        stargazers_count: 5,
        forks_count: 2,
      };

      render(
        <HomeItem repo={smallRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("⭐ 5")).toBeTruthy();
      expect(screen.getByText("🍴 2")).toBeTruthy();
    });
  });

  describe("Owner Information", () => {
    it("displays owner username correctly", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("👤 testuser")).toBeTruthy();
    });

    it("calls onOwnerPress when owner is pressed", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      const ownerButton = screen.getByText("👤 testuser");

      act(() => {
        fireEvent.press(ownerButton);
      });

      expect(mockOnOwnerPress).toHaveBeenCalledWith("testuser");
      expect(mockOnOwnerPress).toHaveBeenCalledTimes(1);
    });

    it("calls onOwnerPress with correct username for different owners", () => {
      const differentOwnerRepo = {
        ...mockRepo,
        owner: {
          ...mockRepo.owner,
          login: "differentuser",
        },
      };

      render(
        <HomeItem
          repo={differentOwnerRepo}
          index={0}
          onOwnerPress={mockOnOwnerPress}
        />
      );

      const ownerButton = screen.getByText("👤 differentuser");

      act(() => {
        fireEvent.press(ownerButton);
      });

      expect(mockOnOwnerPress).toHaveBeenCalledWith("differentuser");
    });
  });

  describe("Date Formatting", () => {
    it("displays updated date correctly", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText(/📅/)).toBeTruthy();
    });

    it("handles different date formats", () => {
      const oldRepo = {
        ...mockRepo,
        updated_at: "2020-12-25T00:00:00Z",
      };

      render(
        <HomeItem repo={oldRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText(/📅/)).toBeTruthy();
    });
  });

  describe("Component Structure", () => {
    it("renders all required elements", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("1.")).toBeTruthy();
      expect(screen.getByText("test-repo")).toBeTruthy();
      expect(
        screen.getByText(
          "This is a test repository with a long description that should be truncated"
        )
      ).toBeTruthy();
      expect(screen.getByText("⭐ 1.5k")).toBeTruthy();
      expect(screen.getByText("🍴 250")).toBeTruthy();
      expect(screen.getByText("💻 JavaScript")).toBeTruthy();
      expect(screen.getByText("👤 testuser")).toBeTruthy();
      expect(screen.getByText(/📅/)).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("handles very large numbers correctly", () => {
      const veryLargeRepo = {
        ...mockRepo,
        stargazers_count: 999999,
        forks_count: 999999,
      };

      render(
        <HomeItem
          repo={veryLargeRepo}
          index={0}
          onOwnerPress={mockOnOwnerPress}
        />
      );

      expect(screen.getByText("⭐ 1000.0k")).toBeTruthy();
      expect(screen.getByText("🍴 1000.0k")).toBeTruthy();
    });

    it("handles zero values correctly", () => {
      const zeroRepo = {
        ...mockRepo,
        stargazers_count: 0,
        forks_count: 0,
      };

      render(
        <HomeItem repo={zeroRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      expect(screen.getByText("⭐ 0")).toBeTruthy();
      expect(screen.getByText("🍴 0")).toBeTruthy();
    });

    it("handles missing optional fields gracefully", () => {
      const minimalRepo = {
        id: 1,
        name: "minimal-repo",
        full_name: "testuser/minimal-repo",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        updated_at: "2023-01-01T00:00:00Z",
        owner: {
          login: "testuser",
          id: 123,
          avatar_url: "https://example.com/avatar.jpg",
          html_url: "https://github.com/testuser",
          type: "User",
        },
      };

      render(
        <HomeItem
          repo={minimalRepo}
          index={0}
          onOwnerPress={mockOnOwnerPress}
        />
      );

      expect(screen.getByText("1.")).toBeTruthy();
      expect(screen.getByText("minimal-repo")).toBeTruthy();
      expect(screen.getByText("👤 testuser")).toBeTruthy();
      expect(screen.getByText("⭐ 0")).toBeTruthy();
      expect(screen.getByText("🍴 0")).toBeTruthy();

      expect(screen.queryByText("💻")).toBeNull();
    });
  });

  describe("User Interactions", () => {
    it("handles multiple owner presses correctly", () => {
      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={mockOnOwnerPress} />
      );

      const ownerButton = screen.getByText("👤 testuser");

      act(() => {
        fireEvent.press(ownerButton);
        fireEvent.press(ownerButton);
        fireEvent.press(ownerButton);
      });

      expect(mockOnOwnerPress).toHaveBeenCalledTimes(3);
      expect(mockOnOwnerPress).toHaveBeenCalledWith("testuser");
    });

    it("handles different callback functions", () => {
      const differentCallback = jest.fn();

      render(
        <HomeItem repo={mockRepo} index={0} onOwnerPress={differentCallback} />
      );

      const ownerButton = screen.getByText("👤 testuser");

      act(() => {
        fireEvent.press(ownerButton);
      });

      expect(differentCallback).toHaveBeenCalledWith("testuser");
      expect(mockOnOwnerPress).not.toHaveBeenCalled();
    });
  });
});
