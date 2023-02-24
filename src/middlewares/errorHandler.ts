import { NextFunction, Request, RequestHandler, Response } from "express";

class CustomError extends Error {
  statusCode?: number;
  validation?: any;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    status_code: statusCode,
    message: err.message,
    validation: err.validation,
  });
};

export { errorHandler, CustomError };
