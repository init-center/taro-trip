import { navigateTo as taroNavigateTo } from "@tarojs/taro";

export const navigateTo = (
  url: string,
  data?: {
    [key: string]: any;
  },
) => {
  let searchStr = "";
  if (data) {
    searchStr = Object.keys(data)
      .map(key => `${key}=${data[key]}`)
      .join("&");
  }
  return taroNavigateTo({
    url: `${url}${searchStr ? `?${searchStr}` : ""}`,
  });
};
