import {
  fetchPublicRepos,
  fetchUserDetails,
  GithubUser,
  searchRepos,
} from "@/apis/github";
import {
  fetchProfileSaga,
  fetchReposSaga,
  fetchSuggestionsSaga,
  fetchUserSaga,
  refetchOnFilterChange,
} from "@/redux/sagas/repoSaga";
import {
  fetchProfileFailure,
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchReposFailure,
  fetchReposRequest,
  fetchReposSuccess,
  fetchSuggestionsFailure,
  fetchSuggestionsRequest,
  fetchSuggestionsSuccess,
  fetchUserFailure,
  fetchUserRequest,
  fetchUserSuccess,
} from "@/redux/slices/repoSlice";
import { call, put, select } from "redux-saga/effects";

jest.mock("@/apis/github", () => ({
  fetchPublicRepos: jest.fn(),
  searchRepos: jest.fn(),
  fetchUserDetails: jest.fn(),
}));

describe("repoSaga tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchReposSaga", () => {
    it("handles success", () => {
      const action = fetchReposRequest({ query: "react", page: 1 });
      const gen = fetchReposSaga(action);

      expect(gen.next().value).toEqual(select());

      const mockState = { repos: { sortBy: "stars", orderBy: "desc" } };
      expect(gen.next(mockState).value).toEqual(
        call(fetchPublicRepos, "react", 1, 20, "stars", "desc")
      );

      const mockResponse = {
        items: Array(20).fill({ id: 1, name: "repo" }),
        total_count: 100,
      };
      expect(gen.next(mockResponse).value).toEqual(
        put(
          fetchReposSuccess({
            repos: mockResponse.items,
            page: 1,
            hasMore: true,
          })
        )
      );

      expect(gen.next().done).toBe(true);
    });

    it("handles failure", () => {
      const action = fetchReposRequest({ query: "react", page: 1 });
      const gen = fetchReposSaga(action);

      expect(gen.next().value).toEqual(select());
      expect(gen.throw(new Error("fail")).value).toEqual(
        put(fetchReposFailure("fail"))
      );
      expect(gen.next().done).toBe(true);
    });
  });

  describe("fetchSuggestionsSaga", () => {
    it("returns empty if query < 2 chars", () => {
      const action = fetchSuggestionsRequest("r");
      const gen = fetchSuggestionsSaga(action);

      expect(gen.next().value).toEqual(put(fetchSuggestionsSuccess([])));
      expect(gen.next().done).toBe(true);
    });

    it("handles success with API suggestions", () => {
      const action = fetchSuggestionsRequest("react");
      const gen = fetchSuggestionsSaga(action);

      expect(gen.next().value).toEqual(call(searchRepos, "react", 1));

      const mockResponse = [{ name: "react-router" }, { name: "react-native" }];
      expect(gen.next(mockResponse).value).toEqual(
        put(
          fetchSuggestionsSuccess(
            expect.arrayContaining(["react", "react-router", "react-native"])
          )
        )
      );
    });

    it("falls back to popular repos when API fails", () => {
      const action = fetchSuggestionsRequest("vue");
      const gen = fetchSuggestionsSaga(action);

      expect(gen.next().value).toEqual(call(searchRepos, "vue", 1));
      expect(gen.throw(new Error("API fail")).value).toEqual(
        put(fetchSuggestionsSuccess(expect.arrayContaining(["vue"])))
      );
    });

    it("handles outer failure", () => {
      const action = fetchSuggestionsRequest("react");
      const gen = fetchSuggestionsSaga(action);

      gen.next();
      gen.next();

      const error = new Error("big fail");
      const result = gen.throw(error).value;

      expect(result).toEqual(put(fetchSuggestionsFailure()));
    });
  });

  describe("fetchUserSaga", () => {
    it("handles success", () => {
      const action = fetchUserRequest("octocat");
      const gen = fetchUserSaga(action);

      expect(gen.next().value).toEqual(call(fetchUserDetails, "octocat"));

      const mockUser: GithubUser = {
        login: "test",
        id: 1,
        avatar_url: "https://example.com/avatar.png",
        html_url: "https://github.com/test",
        type: "User",
        name: "Test User",
        company: "Test Co",
        blog: "https://blog.example.com",
        location: "Earth",
        email: "test@example.com",
        bio: "Just a test user",
        twitter_username: "testuser",
        public_repos: 10,
        followers: 5,
        following: 3,
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2020-01-02T00:00:00Z",
      };

      expect(gen.next(mockUser).value).toEqual(put(fetchUserSuccess(mockUser)));
      expect(gen.next().done).toBe(true);
    });

    it("handles failure", () => {
      const action = fetchUserRequest("octocat");
      const gen = fetchUserSaga(action);

      expect(gen.next().value).toEqual(call(fetchUserDetails, "octocat"));
      expect(gen.throw(new Error("fail")).value).toEqual(
        put(fetchUserFailure("fail"))
      );
    });
  });

  describe("fetchProfileSaga", () => {
    it("handles success", () => {
      const action = fetchProfileRequest("octocat");
      const gen = fetchProfileSaga(action);

      expect(gen.next().value).toEqual(call(fetchUserDetails, "octocat"));
      const mockUser: GithubUser = {
        login: "test",
        id: 1,
        avatar_url: "https://example.com/avatar.png",
        html_url: "https://github.com/test",
        type: "User",
        name: "Test User",
        company: "Test Co",
        blog: "https://blog.example.com",
        location: "Earth",
        email: "test@example.com",
        bio: "Just a test user",
        twitter_username: "testuser",
        public_repos: 10,
        followers: 5,
        following: 3,
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2020-01-02T00:00:00Z",
      };
      expect(gen.next(mockUser).value).toEqual(
        put(fetchProfileSuccess(mockUser))
      );
      expect(gen.next().done).toBe(true);
    });

    it("handles failure", () => {
      const action = fetchProfileRequest("octocat");
      const gen = fetchProfileSaga(action);

      expect(gen.next().value).toEqual(call(fetchUserDetails, "octocat"));
      expect(gen.throw(new Error("fail")).value).toEqual(
        put(fetchProfileFailure("fail"))
      );
    });
  });

  describe("refetchOnFilterChange", () => {
    it("dispatches fetchReposRequest when searchQuery exists", () => {
      const gen = refetchOnFilterChange();
      expect(gen.next().value).toEqual(select());

      const state = { repos: { searchQuery: "react" } };
      expect(gen.next(state).value).toEqual(
        put(fetchReposRequest({ query: "react", page: 1 }))
      );
      expect(gen.next().done).toBe(true);
    });

    it("does nothing when no searchQuery", () => {
      const gen = refetchOnFilterChange();
      expect(gen.next().value).toEqual(select());

      const state = { repos: { searchQuery: "" } };
      expect(gen.next(state).done).toBe(true);
    });
  });
});
