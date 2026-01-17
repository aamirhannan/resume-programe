import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root directory (../.env)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from '#src/routes/index';
// import connectDB from '#src/config/db';
import { startWorker } from '#src/workers/jobWorker';
import { authMiddleware } from '#src/middleware/authMiddleware';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '#src/config/swagger';

const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
// connectDB();


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
// Apply global auth middleware effectively, or specific to /api
app.use('/api', authMiddleware, routes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Start the background worker
    startWorker();
});
