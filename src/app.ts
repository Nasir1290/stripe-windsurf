import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import { StripeRoutes } from './modules/stripe/stripe.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1/stripe', StripeRoutes);

// Testing route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express + TypeScript Server');
});

// Handle Not Found
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
