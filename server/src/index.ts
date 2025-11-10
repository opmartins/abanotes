import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db/client';
import router from './routes';
import errorHandler from './middleware/error';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Allow web app on 8080 to call API on 3000 during local/dev
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: false
}));
app.use('/api', router);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

// Error handling middleware (after routes)
app.use(errorHandler);