import express from 'express';
import cors from 'cors';
import { config } from '@core/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './core/error-handling';
import authRoutes from './api/auth/routes';
import taskRoutes from './api/task/routes'
import { prisma } from './lib/prisma';
import profileRouter from '@api/profile/routes';

export const app = express();

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next()
})

// Middlewares
app.use(helmet());
app.use(cors({ origin: config.cors_origin }));
app.use(express.json({ limit: '10kb' }));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('api/task', taskRoutes);
app.use('/api/profile', profileRouter);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'up',
        timeStamp: new Date().toISOString(),
        environment: config.node_env
    });
});

// Error Handling
app.use(errorHandler);

// Server Startup
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected');
        const PORT = Number(config.port);
        const server = app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
            console.log(`Environment: ${config.node_env}`);
        });
        process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully');
        server.close(() => {
            prisma.$disconnect();
            console.log('Server terminated');
            });
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

export default startServer;