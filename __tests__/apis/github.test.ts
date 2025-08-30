import {
    fetchPublicRepos,
    fetchUserDetails,
    GithubUser,
    searchRepos,
} from "@/apis/github";
import { GithubRepoResponse } from "@/apis/models";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("github.ts API functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchPublicRepos", () => {
    it("should fetch repositories with query and pagination", async () => {
      const mockResponse: GithubRepoResponse = {
        total_count: 1,
        incomplete_results: false,
        items: [{ id: 1, name: "test-repo" } as any],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await fetchPublicRepos("react", 1, 10);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(
          "search/repositories?q=react&page=1&per_page=10"
        )
      );
      expect(result).toEqual(mockResponse);
    });

    it("should fetch repos without sort and order params", async () => {
      const mockData = { items: [], total_count: 0, incomplete_results: false };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchPublicRepos("react", 1, 10);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("q=react&page=1&per_page=10")
      );
      expect(result).toEqual(mockData);
    });

    it("should include sort and order when provided", async () => {
      const mockResponse: GithubRepoResponse = {
        total_count: 1,
        incomplete_results: false,
        items: [{ id: 2, name: "sorted-repo" } as any],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await fetchPublicRepos("react", 2, 5, "stars", "desc");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(
          "search/repositories?q=react&page=2&per_page=5&sort=stars&order=desc"
        )
      );
      expect(result.items[0].name).toBe("sorted-repo");
    });

    it("should throw if axios request fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchPublicRepos("react", 1)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("searchRepos", () => {
    it("should return items from search", async () => {
      const mockResponse: GithubRepoResponse = {
        total_count: 1,
        incomplete_results: false,
        items: [{ id: 3, name: "search-repo" } as any],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await searchRepos("vue", 1);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("search/repositories"),
        expect.objectContaining({
          params: { q: "vue", page: 1, per_page: 20 },
        })
      );
      expect(result).toEqual(mockResponse.items);
    });

    it("should handle empty items", async () => {
      const mockResponse: GithubRepoResponse = {
        total_count: 0,
        incomplete_results: false,
        items: [],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await searchRepos("unknown", 1);

      expect(result).toEqual([]);
    });

    it("should throw if axios request fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Server error"));

      await expect(searchRepos("vue", 1)).rejects.toThrow("Server error");
    });
  });

  describe("fetchUserDetails", () => {
    it("should return user details", async () => {
      const mockUser: GithubUser = {
        login: "octocat",
        id: 1,
        avatar_url: "avatar",
        html_url: "url",
        type: "User",
        name: "The Octocat",
        company: "GitHub",
        blog: "https://github.blog",
        location: "Internet",
        email: null,
        bio: "Test user",
        twitter_username: null,
        public_repos: 2,
        public_gists: 1,
        followers: 10,
        following: 5,
        created_at: "2020-01-01",
        updated_at: "2020-01-02",
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await fetchUserDetails("octocat");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.github.com/users/octocat"
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw if axios request fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Not Found"));

      await expect(fetchUserDetails("missinguser")).rejects.toThrow(
        "Not Found"
      );
    });
  });
});
