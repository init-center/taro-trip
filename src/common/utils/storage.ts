import { getStorageSync, setStorageSync, removeStorageSync } from "@tarojs/taro";

export interface StorageData<T = any> {
  startTime: number;
  expireTime: number;
  data: T;
}

// time: seconds, default 24 hours
export const setStorageSyncWithTime = <T = any>(key: string, value: T, time = 60 * 60 * 24) => {
  try {
    const startTime = Date.now();
    const expireTime = startTime + time * 1000;
    setStorageSync(key, {
      data: value,
      startTime,
      expireTime,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getStorageSyncWithTime = <T = any>(key: string): T | null => {
  try {
    const data = getStorageSync<StorageData<T>>(key);
    if (!data) {
      return null;
    }
    if (!data.expireTime || !data.data) {
      return null;
    }
    const { expireTime, data: value } = data;
    if (Date.now() > expireTime) {
      removeStorageSync(key);
      return null;
    }
    return value;
  } catch (err) {
    console.error(err);
    return null;
  }
};
