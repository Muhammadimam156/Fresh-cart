import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { healthRouter } from './routes/healthRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { categoryRouter } from './routes/categoryRoutes.js';
import { productRouter } from './routes/productRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { contactRouter } from './routes/contactRoutes.js';
import { settingsRouter } from './routes/settingsRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { uploadRouter } from './routes/uploadRoutes.js';
import { couponRouter } from './routes/couponRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { runSeed } from './controllers/seedController.js';
import { connectDB } from './config/db.js';

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || configuredOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady && process.env.MONGO_URI) {
    try {
      await connectDB();
      dbReady = true;
    } catch (err) {
      console.error('DB connection failed:', err);
    }
  }
  next();
});

app.get('/', (_, res) => {
  res.json({ message: 'Grocery API is running' });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/contact', contactRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/coupons', couponRouter);
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/dev/seed', runSeed);
}

app.use(notFound);
app.use(errorHandler);

export default app;