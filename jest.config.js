module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  collectCoverageFrom: [
    "apis/**/*.{ts,tsx}",
    "redux/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "screens/**/*.{ts,tsx}",
    "navigation/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",

    // ignore boilerplate
    "!**/*.d.ts",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.setup.js",
    "!**/jest.config.js",
    "!redux/store.ts",
    "!redux/reducer.ts",
    "!redux/sagas/index.ts",
    "!apis/models.ts",
    "!**/_layout.tsx",
    "!**/index.tsx",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jsdom",
};
