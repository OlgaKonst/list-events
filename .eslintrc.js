module.exports = {
  extends: ["airbnb-base", "prettier"],
  env: {
    browser: true
  },
  overrides: [
    {
      files: ["**/*.test.js"],
      env: {
        jest: true
      }
    }
  ]
};
