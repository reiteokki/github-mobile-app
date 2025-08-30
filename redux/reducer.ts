import { combineReducers } from "@reduxjs/toolkit";
import { GithubRepos } from "./slices/repoSlice";

export const rootReducer = combineReducers({
  GithubRepos: GithubRepos,
});
