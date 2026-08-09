export function createApp() {
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

  // 👇 DB-connect middleware yahan add karein, routes se PEHLE
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

  return app;
}

const app = createApp();

export default app;