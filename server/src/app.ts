// Deprecated duplicate bootstrap file. The application now starts from index.ts.
// Keeping minimal export if other modules import `app` for testing.
import express from 'express';
const app = express();
export default app;