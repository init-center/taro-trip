module.exports = {
  extends: ["taro/react", "plugin:prettier/recommended"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "import/no-commonjs": "off",
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    semi: ["error", "always"],
    "prettier/prettier": "error",
  },
  env: {
    jest: true,
  },
};
