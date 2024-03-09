import { showToast as taroShowToast } from "@tarojs/taro";

type OriginToastOptions = Parameters<typeof taroShowToast>[0];
export type ToastOptions = OriginToastOptions | string;

export const showToast = (options?: ToastOptions) => {
  let opts: OriginToastOptions = {
    title: "温馨提示",
    icon: "none",
    mask: true,
    duration: 2000,
  };

  if (typeof options === "string") {
    opts.title = options;
  } else {
    opts = {
      ...opts,
      ...options,
    };
  }
  return taroShowToast(opts);
};
