import { request as TaroRequest } from "@tarojs/taro";

export type RequestOption<T = any, U = any> = Parameters<typeof TaroRequest<T, U>>[0];

export type ResponseData<T = any> = {
  code: number;
  data?: T;
  msg: string;
};

export const request = <T = any, U = any>(opts: RequestOption<ResponseData<T>, U>) => {
  return new Promise<T>((resolve, reject) => {
    return TaroRequest(opts)
      .then(res => {
        if (res.statusCode === 200 && res.data.code === 0 && res.data.data) {
          resolve(res.data.data);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
