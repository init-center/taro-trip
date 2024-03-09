import { ENV_TYPE, getEnv } from "@tarojs/taro";

const currentEnv = getEnv();

export const isAliPay = ENV_TYPE.ALIPAY === currentEnv;
export const isBaiDu = ENV_TYPE.SWAN === currentEnv;
export const isWeChat = ENV_TYPE.WEAPP === currentEnv;
export const isH5 = ENV_TYPE.WEB === currentEnv;
