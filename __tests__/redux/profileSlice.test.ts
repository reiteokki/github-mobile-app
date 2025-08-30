import profileReducer, {
  clearLocalPhoto,
  setCurrentUsername,
  setLocalPhoto,
} from "../../redux/slices/profileSlice";

describe("Profile Slice", () => {
  const initialState = {
    currentUsername: "octocat",
    localPhotoUri: null,
  };

  describe("Initial State", () => {
    it("should return the initial state", () => {
      expect(profileReducer(undefined, { type: "unknown" })).toEqual(
        initialState
      );
    });
  });

  describe("setCurrentUsername", () => {
    it("should update the current username", () => {
      const newUsername = "newuser";
      const action = setCurrentUsername(newUsername);
      const newState = profileReducer(initialState, action);

      expect(newState.currentUsername).toBe(newUsername);
      expect(newState.localPhotoUri).toBe(null);
    });

    it("should handle empty username", () => {
      const action = setCurrentUsername("");
      const newState = profileReducer(initialState, action);

      expect(newState.currentUsername).toBe("");
    });

    it("should handle username with spaces", () => {
      const action = setCurrentUsername("  spaceduser  ");
      const newState = profileReducer(initialState, action);

      expect(newState.currentUsername).toBe("  spaceduser  ");
    });
  });

  describe("setLocalPhoto", () => {
    it("should set the local photo URI", () => {
      const photoUri = "file://test-photo.jpg";
      const action = setLocalPhoto(photoUri);
      const newState = profileReducer(initialState, action);

      expect(newState.localPhotoUri).toBe(photoUri);
      expect(newState.currentUsername).toBe("octocat");
    });

    it("should handle empty photo URI", () => {
      const action = setLocalPhoto("");
      const newState = profileReducer(initialState, action);

      expect(newState.localPhotoUri).toBe("");
    });

    it("should override existing photo URI", () => {
      const stateWithPhoto = {
        ...initialState,
        localPhotoUri: "file://old-photo.jpg",
      };

      const newPhotoUri = "file://new-photo.jpg";
      const action = setLocalPhoto(newPhotoUri);
      const newState = profileReducer(stateWithPhoto, action);

      expect(newState.localPhotoUri).toBe(newPhotoUri);
    });
  });

  describe("clearLocalPhoto", () => {
    it("should clear the local photo URI", () => {
      const stateWithPhoto = {
        ...initialState,
        localPhotoUri: "file://test-photo.jpg",
      };

      const action = clearLocalPhoto();
      const newState = profileReducer(stateWithPhoto, action);

      expect(newState.localPhotoUri).toBe(null);
      expect(newState.currentUsername).toBe("octocat");
    });

    it("should handle clearing when no photo is set", () => {
      const action = clearLocalPhoto();
      const newState = profileReducer(initialState, action);

      expect(newState.localPhotoUri).toBe(null);
    });
  });

  describe("Multiple Actions", () => {
    it("should handle multiple actions correctly", () => {
      let state = profileReducer(initialState, setCurrentUsername("user1"));
      expect(state.currentUsername).toBe("user1");

      state = profileReducer(state, setLocalPhoto("file://photo1.jpg"));
      expect(state.localPhotoUri).toBe("file://photo1.jpg");
      expect(state.currentUsername).toBe("user1");

      state = profileReducer(state, setCurrentUsername("user2"));
      expect(state.currentUsername).toBe("user2");
      expect(state.localPhotoUri).toBe("file://photo1.jpg");

      state = profileReducer(state, clearLocalPhoto());
      expect(state.localPhotoUri).toBe(null);
      expect(state.currentUsername).toBe("user2");
    });
  });

  describe("Action Creators", () => {
    it("should create setCurrentUsername action with correct payload", () => {
      const username = "testuser";
      const action = setCurrentUsername(username);

      expect(action.type).toBe("profile/setCurrentUsername");
      expect(action.payload).toBe(username);
    });

    it("should create setLocalPhoto action with correct payload", () => {
      const photoUri = "file://test.jpg";
      const action = setLocalPhoto(photoUri);

      expect(action.type).toBe("profile/setLocalPhoto");
      expect(action.payload).toBe(photoUri);
    });

    it("should create clearLocalPhoto action without payload", () => {
      const action = clearLocalPhoto();

      expect(action.type).toBe("profile/clearLocalPhoto");
      expect(action.payload).toBeUndefined();
    });
  });
});
