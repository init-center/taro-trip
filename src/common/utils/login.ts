import { getStorageSyncWithTime } from "../utils/storage";
import { navigateTo } from "../utils/router";

export function doLogin(fn?: (...args: any[]) => any) {
  const userInfo = getStorageSyncWithTime("userInfo");
  if (!userInfo) {
    navigateTo("/pages/login/login");
    return;
  }
  fn?.();
}
