module.exports = {
  "**/*": "prettier --write --ignore-unknown",
  "**/*.{js,cjs,jsx,ts,tsx}": ["eslint --cache --fix", "git add ."],
};
