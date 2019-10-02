import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    dotenv.config({ path : '.env' });
}

export const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID as string;
export const BUCKET_REGION = process.env.BUCKET_REGION as string;
export const BUCKET_NAME = process.env.BUCKET_NAME as string;