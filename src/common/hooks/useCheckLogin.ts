import { useDidShow } from "@tarojs/taro";
import { doLogin } from "../utils/login";

export function useCheckLogin() {
  useDidShow(() => {
    doLogin();
  });
}
