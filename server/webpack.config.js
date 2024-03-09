import path from "node:path";

const isProduction = process.env.NODE_ENV == "production";

/**
 * @type {import("webpack").Configuration}
 */
const config = {
  entry: "./src/index.ts",
  target: "node",
  output: {
    path: path.resolve(import.meta.dirname, "dist"),
    filename: "index.js",
    clean: true,
    library: {
      type: "module",
    },
    chunkFormat: "module",
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  experiments: {
    outputModule: true,
  },
};

export default () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
