import { type Response } from "express";

export function response(res: Response, status: number, data: any, message: string, code: number) {
  return res.status(status).json({
    data,
    message,
    code,
  });
}

export function success(res: Response, data: any, message: string = "OK") {
  return response(res, 200, data, message, 0);
}

export function fail(res: Response, message: string = "FAIL") {
  return response(res, 400, null, message, -1);
}

export function notFound(res: Response, message: string = "Not Found") {
  return response(res, 404, null, message, -1);
}
