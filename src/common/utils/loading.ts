import { showLoading as taroShowLoading, hideLoading as taroHideLoading } from "@tarojs/taro";

type OriginLoadingOptions = Parameters<typeof taroShowLoading>[0];
export type LoadingOptions = OriginLoadingOptions | string;

export const showLoading = (options?: LoadingOptions) => {
  let opts: OriginLoadingOptions = {
    title: "加载中...",
    mask: true,
  };

  if (typeof options === "string") {
    opts.title = options;
  } else {
    opts = {
      ...opts,
      ...options,
    };
  }
  return taroShowLoading(opts);
};

export const hideLoading = taroHideLoading;
