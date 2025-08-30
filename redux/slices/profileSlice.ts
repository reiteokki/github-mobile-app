import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  currentUsername: string;
  localPhotoUri: string | null;
}

const initialState: ProfileState = {
  currentUsername: "octocat",
  localPhotoUri: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setCurrentUsername: (state, action: PayloadAction<string>) => {
      state.currentUsername = action.payload;
    },
    setLocalPhoto: (state, action: PayloadAction<string>) => {
      state.localPhotoUri = action.payload;
    },
    clearLocalPhoto: (state) => {
      state.localPhotoUri = null;
    },
  },
});

export const { setCurrentUsername, setLocalPhoto, clearLocalPhoto } = profileSlice.actions;
export default profileSlice.reducer;
