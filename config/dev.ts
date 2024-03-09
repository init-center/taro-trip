import type { UserConfigExport } from "@tarojs/cli";

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      host: "localhost",
      proxy: [
        {
          context: ["/api/"],
          target: "http://localhost:3456",
          pathRewrite: { "^/api/": "" },
          changeOrigin: true,
        },
      ],
    },
  },
} satisfies UserConfigExport;
