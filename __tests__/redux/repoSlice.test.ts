import reducer, {
    clearError,
    clearSuggestions,
    clearUser,
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
    setIsEditingUsername,
    setOrderBy,
    setSortBy,
} from "@/redux/slices/repoSlice";

describe("repoSlice", () => {
  const initialState = reducer(undefined, { type: "@@INIT" });

  it("should return the initial state", () => {
    expect(initialState).toMatchObject({
      repos: [],
      loading: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      searchQuery: "",
      suggestions: [],
      suggestionsLoading: false,
      sortBy: "stars",
      orderBy: "desc",
      selectedUser: null,
      userLoading: false,
      userError: null,
      profileUser: null,
      profileLoading: false,
      profileError: null,
      isEditingUsername: false,
    });
  });

  it("handles fetchReposRequest with page=1", () => {
    const state = reducer(
      initialState,
      fetchReposRequest({ query: "react", page: 1 })
    );
    expect(state.loading).toBe(true);
    expect(state.searchQuery).toBe("react");
    expect(state.repos).toEqual([]);
  });

  it("handles fetchReposSuccess on page=1 (replace)", () => {
    const repos = [{ id: 1 }, { id: 2 }] as any;
    const state = reducer(
      initialState,
      fetchReposSuccess({ repos, page: 1, hasMore: true })
    );
    expect(state.repos).toEqual(repos);
    expect(state.currentPage).toBe(1);
  });

  it("handles fetchReposSuccess on page>1 (append)", () => {
    const prevState = { ...initialState, repos: [{ id: 1 }] as any };
    const state = reducer(
      prevState,
      fetchReposSuccess({ repos: [{ id: 2 }] as any, page: 2, hasMore: false })
    );
    expect(state.repos).toEqual([{ id: 1 }, { id: 2 }]);
    expect(state.currentPage).toBe(2);
    expect(state.hasMore).toBe(false);
  });

  it("handles fetchReposFailure", () => {
    const state = reducer(initialState, fetchReposFailure("error"));
    expect(state.error).toBe("error");
    expect(state.loading).toBe(false);
  });

  it("handles suggestions flow", () => {
    let state = reducer(initialState, fetchSuggestionsRequest("r"));
    expect(state.suggestionsLoading).toBe(true);

    state = reducer(state, fetchSuggestionsSuccess(["react", "redux"]));
    expect(state.suggestions).toEqual(["react", "redux"]);
    expect(state.suggestionsLoading).toBe(false);

    state = reducer(state, fetchSuggestionsFailure());
    expect(state.suggestions).toEqual([]);

    state = reducer(state, clearSuggestions());
    expect(state.suggestions).toEqual([]);
  });

  it("handles clearError", () => {
    const prevState = { ...initialState, error: "oops" };
    const state = reducer(prevState, clearError());
    expect(state.error).toBeNull();
  });

  it("handles setSortBy & setOrderBy", () => {
    let state = reducer(initialState, setSortBy("forks"));
    expect(state.sortBy).toBe("forks");
    expect(state.repos).toEqual([]);
    expect(state.currentPage).toBe(1);

    state = reducer(initialState, setOrderBy("asc"));
    expect(state.orderBy).toBe("asc");
  });

  it("handles user flow", () => {
    let state = reducer(initialState, fetchUserRequest("octocat"));
    expect(state.userLoading).toBe(true);

    state = reducer(state, fetchUserSuccess({ login: "octocat" } as any));
    expect(state.selectedUser).toEqual({ login: "octocat" });

    state = reducer(state, fetchUserFailure("not found"));
    expect(state.userError).toBe("not found");
    expect(state.selectedUser).toBeNull();

    state = reducer(state, clearUser());
    expect(state.selectedUser).toBeNull();
    expect(state.userError).toBeNull();
  });

  it("handles profile flow", () => {
    let state = reducer(initialState, fetchProfileRequest("octocat"));
    expect(state.profileLoading).toBe(true);

    state = reducer(state, fetchProfileSuccess({ login: "octocat" } as any));
    expect(state.profileUser).toEqual({ login: "octocat" });

    state = reducer(state, fetchProfileFailure("error"));
    expect(state.profileError).toBe("error");
    expect(state.profileUser).toBeNull();
  });

  it("handles setIsEditingUsername", () => {
    const state = reducer(initialState, setIsEditingUsername(true));
    expect(state.isEditingUsername).toBe(true);
  });
});
