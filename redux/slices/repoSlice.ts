import { GithubUser } from "@/apis/github";
import { GithubRepoItemProps } from "@/apis/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SortOption = "stars" | "forks" | "help-wanted-issues" | "updated";
export type OrderOption = "asc" | "desc";

interface RepoState {
  repos: GithubRepoItemProps[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  searchQuery: string;
  suggestions: string[];
  suggestionsLoading: boolean;
  sortBy: SortOption;
  orderBy: OrderOption;
  selectedUser: GithubUser | null;
  userLoading: boolean;
  userError: string | null;
  profileUser: GithubUser | null;
  profileLoading: boolean;
  profileError: string | null;
  isEditingUsername: boolean;
}

const initialState: RepoState = {
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
};

export const GithubRepos = createSlice({
  name: "GithubRepos",
  initialState,
  reducers: {
    fetchReposRequest: (state, action: PayloadAction<{ query: string; page: number }>) => {
      state.loading = true;
      state.error = null;
      state.searchQuery = action.payload.query;
      if (action.payload.page === 1) {
        state.repos = [];
        state.currentPage = 1;
      }
    },
    fetchReposSuccess: (
      state,
      action: PayloadAction<{ repos: GithubRepoItemProps[]; page: number; hasMore: boolean }>
    ) => {
      state.loading = false;
      state.error = null;
      state.currentPage = action.payload.page;
      state.hasMore = action.payload.hasMore;
      
      if (action.payload.page === 1) {
        state.repos = action.payload.repos;
      } else {
        state.repos = [...state.repos, ...action.payload.repos];
      }
    },
    fetchReposFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSuggestionsRequest: (state, action: PayloadAction<string>) => {
      state.suggestionsLoading = true;
    },
    fetchSuggestionsSuccess: (state, action: PayloadAction<string[]>) => {
      state.suggestionsLoading = false;
      state.suggestions = action.payload;
    },
    fetchSuggestionsFailure: (state) => {
      state.suggestionsLoading = false;
      state.suggestions = [];
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
      state.repos = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    setOrderBy: (state, action: PayloadAction<OrderOption>) => {
      state.orderBy = action.payload;
      state.repos = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    fetchUserRequest: (state, action: PayloadAction<string>) => {
      state.userLoading = true;
      state.userError = null;
      state.selectedUser = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<GithubUser>) => {
      state.userLoading = false;
      state.userError = null;
      state.selectedUser = action.payload;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.userLoading = false;
      state.userError = action.payload;
      state.selectedUser = null;
    },
    clearUser: (state) => {
      state.selectedUser = null;
      state.userError = null;
    },

    fetchProfileRequest: (state, action: PayloadAction<string>) => {
      state.profileLoading = true;
      state.profileError = null;
      state.profileUser = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<GithubUser>) => {
      state.profileLoading = false;
      state.profileError = null;
      state.profileUser = action.payload;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.profileLoading = false;
      state.profileError = action.payload;
      state.profileUser = null;
    },
    setIsEditingUsername: (state, action: PayloadAction<boolean>) => {
      state.isEditingUsername = action.payload;
    },
  },
});

export const { 
  fetchReposRequest, 
  fetchReposSuccess, 
  fetchReposFailure,
  fetchSuggestionsRequest,
  fetchSuggestionsSuccess,
  fetchSuggestionsFailure,
  clearSuggestions,
  clearError,
  setSortBy,
  setOrderBy,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  clearUser,
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  setIsEditingUsername
} = GithubRepos.actions;

export default GithubRepos.reducer;
