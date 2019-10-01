import { Request, Response, NextFunction } from 'express';

const asyncException = (handler: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

export default asyncException;