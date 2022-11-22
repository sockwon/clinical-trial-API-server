/**
 * Module dependencies.
 */
import { Request, Response, NextFunction } from "express";

/**
 * 던져진 에러를 잡아낸다. 주로 미들웨어로 사용됨. routes 에 사용했다.
 * @param {} func
 * @returns void
 */

const errorHandlerAsync = (func: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err: any) {
      let message: any;
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err);
      }
      res.status(err.statusCode || 500).json({ message });
    }
  };
};

/**
 * Module exports.
 * @public
 */

export default errorHandlerAsync;
