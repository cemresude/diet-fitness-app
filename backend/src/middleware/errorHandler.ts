import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode: number;
  code: string;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Bir hata oluştu';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

export const createError = (message: string, statusCode: number, code: string): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'İstenen kaynak bulunamadı',
    },
  });
};
