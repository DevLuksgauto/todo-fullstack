import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    databaseUrl: process.env.DATABASE_URL || '',
    secret_key: process.env.SECRET_KEY || '',
    cors_origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    node_env: process.env.NODE_ENV || 'development'
};
