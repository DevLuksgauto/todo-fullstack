import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    databaseUrl: process.env.DATABASE_URL || '',
    secret_key: process.env.SECRET_KEY || '',
};
