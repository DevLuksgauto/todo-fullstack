import express from 'express';
import cors from 'cors';
import { config } from './core/config';
import authRoutes from './routes/auth.routes';
import protectedRoutes from 'routes/protected.routes';

export const app = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes)

app.get('/', (req, res) => { res.send("Server Started") });

const startServer = () => {
    const PORT = Number(config.port)
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
}

export default startServer;