import { Response } from "express";

type IResponse<T> = {
  statusCode?: number;
  success: boolean;
  message?: string;
  data: T;
  total?: number;
  error?: any;
};

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    message: data.message,
    data: data.data,
    total: data.total,
    error: data.error,
  });
};

export default sendResponse;
