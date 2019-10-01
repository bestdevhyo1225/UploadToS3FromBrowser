import { Request, Response } from 'express';

export const upload = async (req: Request, res: Response): Promise<void> => {
    res.render('upload');
}

export default {
    upload,
}