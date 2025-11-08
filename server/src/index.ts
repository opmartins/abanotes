import express from 'express';
import { connectToDatabase } from './db/client';
import router from './routes';
import errorHandler from './middleware/error';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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