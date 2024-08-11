import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ofacRoutes from './routes/ofac-routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', ofacRoutes);

const PORT: number = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
    // Remove and log to DataDog in real app
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err: Error) => {
    // Remove and log to DataDog + Sentry in real app
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
});
