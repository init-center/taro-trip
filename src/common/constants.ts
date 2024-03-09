import dayjs from "dayjs";

export const MAP_KEY = "HJ3BZ-KVCWB-HWUUN-B4LHP-APL8Q-6GFI9";
export const MAP_SECRET_KEY = "1zbgjjBxaWe189bvnETbyIKn6a823PDG";

export const ERR_MESSAGE = "网络开了小差，请稍后重试～";
export const MIN_DATE = dayjs().format("YYYY-MM-DD");
export const MAX_DATE = dayjs().add(60, "day").format("YYYY-MM-DD");
