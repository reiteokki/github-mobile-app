import { fetchPublicRepos, fetchUserDetails, searchRepos } from "@/apis/github";
import { call, debounce, put, select, takeLatest } from "redux-saga/effects";
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
  setOrderBy,
  setSortBy,
} from "../slices/repoSlice";
import { RootState } from "../store";

const POPULAR_REPOS = [
  "react",
  "vue",
  "angular",
  "node",
  "python",
  "java",
  "javascript",
  "typescript",
  "docker",
  "kubernetes",
  "tensorflow",
  "pytorch",
  "django",
  "flask",
  "express",
  "next.js",
  "nuxt.js",
  "laravel",
  "spring",
  "dotnet",
  "go",
  "rust",
  "swift",
  "kotlin",
  "flutter",
  "react-native",
  "electron",
  "vscode",
  "atom",
  "vim",
];

export function* fetchReposSaga(
  action: ReturnType<typeof fetchReposRequest>
): Generator<any, void, any> {
  try {
    const { query, page } = action.payload;

    const state: RootState = yield select();
    const { sortBy, orderBy } = state.repos;

    const response: any = yield call(
      fetchPublicRepos,
      query,
      page,
      20,
      sortBy,
      orderBy
    );

    const hasMore =
      response.items.length === 20 && response.total_count > page * 20;

    yield put(
      fetchReposSuccess({
        repos: response.items,
        page,
        hasMore,
      })
    );
  } catch (error: any) {
    yield put(
      fetchReposFailure(error.message || "Failed to fetch repositories")
    );
  }
}

export function* fetchSuggestionsSaga(
  action: ReturnType<typeof fetchSuggestionsRequest>
): Generator<any, void, any> {
  try {
    const query = action.payload;

    if (query.length < 2) {
      yield put(fetchSuggestionsSuccess([]));
      return;
    }

    const filteredSuggestions = POPULAR_REPOS.filter((repo) =>
      repo.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    try {
      const response: any = yield call(searchRepos, query, 1);
      const apiSuggestions = response.slice(0, 3).map((repo: any) => repo.name);

      const allSuggestions = [
        ...new Set([...filteredSuggestions, ...apiSuggestions]),
      ];
      yield put(fetchSuggestionsSuccess(allSuggestions.slice(0, 8)));
    } catch {
      yield put(fetchSuggestionsSuccess(filteredSuggestions));
    }
  } catch (error: any) {
    yield put(fetchSuggestionsFailure());
  }
}

export function* refetchOnFilterChange(): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const { searchQuery } = state.repos;

    if (searchQuery) {
      yield put(fetchReposRequest({ query: searchQuery, page: 1 }));
    }
  } catch (error: any) {}
}

export function* fetchUserSaga(
  action: ReturnType<typeof fetchUserRequest>
): Generator<any, void, any> {
  try {
    const username = action.payload;
    const user: any = yield call(fetchUserDetails, username);
    yield put(fetchUserSuccess(user));
  } catch (error: any) {
    yield put(
      fetchUserFailure(error.message || "Failed to fetch user details")
    );
  }
}

export function* fetchProfileSaga(
  action: ReturnType<typeof fetchProfileRequest>
): Generator<any, void, any> {
  try {
    const username = action.payload;
    const user: any = yield call(fetchUserDetails, username);
    yield put(fetchProfileSuccess(user));
  } catch (error: any) {
    yield put(
      fetchProfileFailure(error.message || "Failed to fetch profile details")
    );
  }
}

export function* repoSaga(): Generator<any, void, any> {
  yield takeLatest(fetchReposRequest.type, fetchReposSaga);
  yield debounce(300, fetchSuggestionsRequest.type, fetchSuggestionsSaga);
  yield takeLatest([setSortBy.type, setOrderBy.type], refetchOnFilterChange);
  yield takeLatest(fetchUserRequest.type, fetchUserSaga);
  yield takeLatest(fetchProfileRequest.type, fetchProfileSaga);
}
