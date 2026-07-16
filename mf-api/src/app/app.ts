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

// Error handling middleware
app.use(errorHandlerMiddleware);
app.use('/', notFoundMiddleware);

export { app };
