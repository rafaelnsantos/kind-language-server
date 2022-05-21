// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "@monx/eslint-config-next",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        printWidth: 100,
      },
    ],
  },
};
