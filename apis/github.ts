import axios from "axios";
import { GithubRepoResponse } from "./models";

const BASE_URL = "https://api.github.com";
type SortOption = "stars" | "forks" | "help-wanted-issues" | "updated";
type OrderOption = "asc" | "desc";

export interface GithubUser {
  login: string;
  id: number;
  avatar_url?: string;
  html_url?: string;
  type?: string;
  name?: string | null;
  company?: string | null;
  blog?: string | null;
  location?: string | null;
  email?: string | null;
  bio?: string | null;
  twitter_username?: string | null;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  created_at?: string;
  updated_at?: string;
}

export const fetchPublicRepos = async (
  query: string,
  page: number,
  per_page: number = 10,
  sort?: SortOption,
  order?: OrderOption
) => {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (sort) {
    params.append("sort", sort);
  }

  if (order) {
    params.append("order", order);
  }

  const res = await axios.get<GithubRepoResponse>(
    `${BASE_URL}/search/repositories?${params.toString()}`
  );
  return res.data;
};

export const searchRepos = async (query: string, page: number = 1) => {
  const res = await axios.get<GithubRepoResponse>(
    `${BASE_URL}/search/repositories`,
    {
      params: { q: query, page, per_page: 20 },
    }
  );
  return res.data.items;
};

export const fetchUserDetails = async (
  username: string
): Promise<GithubUser> => {
  const res = await axios.get<GithubUser>(`${BASE_URL}/users/${username}`);
  return res.data;
};
