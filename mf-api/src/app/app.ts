import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { notFoundMiddleware, errorHandlerMiddleware } from './error';
import middleware from './middleware';
import routes from './routes';

const app = express();

// Apply general middleware
app.use(middleware);

// Load routes
app.use(routes);

// Not found middleware (must be before error handler)
app.use('/', notFoundMiddleware);

// Error handling middleware (must be last)
app.use(errorHandlerMiddleware);

export { app };
