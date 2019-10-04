import { IDENTITY_POOL_ID, BUCKET_REGION, BUCKET_NAME } from '../config/aws-cognito';
import { Request, Response } from 'express';


interface CognitoInformation {
    IDENTITY_POOL_ID: string;
    BUCKET_REGION: string;
    BUCKET_NAME: string;
}

const index = async (req: Request, res: Response): Promise<void> => {
    res.render('index');
}

const secret = async (req: Request, res: Response): Promise<void> => {
    const cogInfo = {
        IDENTITY_POOL_ID : IDENTITY_POOL_ID,
        BUCKET_REGION : BUCKET_REGION,
        BUCKET_NAME : BUCKET_NAME
    }
    res.json(cogInfo);
}

export default {
    index,
    secret
}