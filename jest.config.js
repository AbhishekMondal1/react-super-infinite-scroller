module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  // Options that will be passed to the testEnvironment
  testEnvironmentOptions: {
    URL: "http://localhost/",
  },
  verbose: true,
};
