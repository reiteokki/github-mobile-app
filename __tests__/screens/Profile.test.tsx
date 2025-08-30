import React from "react";
import {
  clearLocalPhoto,
  setCurrentUsername,
  setLocalPhoto,
} from "../../redux/slices/profileSlice";
import { setIsEditingUsername } from "../../redux/slices/repoSlice";
import Profile from "../../screens/Profile";
import { act, render, screen } from "../utils/test-utils.test";

describe("Profile Component", () => {
  const defaultState = {
    repos: {
      profileUser: null,
      profileLoading: false,
      profileError: null,
      isEditingUsername: false,
    },
    profile: {
      currentUsername: "testuser",
      localPhotoUri: null,
    },
  };

  it("renders without crashing", () => {
    expect(() =>
      render(<Profile />, { preloadedState: defaultState })
    ).not.toThrow();
  });

  it("provides store access and updates Redux state", () => {
    const { store } = render(<Profile />, { preloadedState: defaultState });

    act(() => store.dispatch(setCurrentUsername("newuser")));
    expect(store.getState().profile.currentUsername).toBe("newuser");

    act(() => store.dispatch(setLocalPhoto("file://photo.jpg")));
    expect(store.getState().profile.localPhotoUri).toBe("file://photo.jpg");

    act(() => store.dispatch(clearLocalPhoto()));
    expect(store.getState().profile.localPhotoUri).toBeNull();

    act(() => store.dispatch(setIsEditingUsername(true)));
    expect(store.getState().repos.isEditingUsername).toBe(true);
  });

  it("renders basic UI elements", () => {
    render(<Profile />, { preloadedState: defaultState });

    expect(screen.getByText(/Loading profile/i)).toBeTruthy();
  });
});
