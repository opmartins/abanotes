import { Router, Express, Request, Response } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { RecordsController } from '../controllers/records.controller';
import authRoutes from './auth.routes';
import { authenticate } from '../middleware/auth';

const router = Router();
const reportsController = new ReportsController();
const recordsController = new RecordsController();

// Healthcheck (público)
router.get('/health', (_req: Request, res: Response) => {
	res.json({ status: 'ok' });
});

// Auth routes (públicas)
router.use('/auth', authRoutes);

// Reports routes (protegidas)
router.get('/reports', authenticate, reportsController.getAllReports.bind(reportsController));
router.post('/reports', authenticate, reportsController.createReport.bind(reportsController));
router.get('/reports/:id', authenticate, reportsController.getReportById.bind(reportsController));
router.put('/reports/:id', authenticate, reportsController.updateReport.bind(reportsController));
router.delete('/reports/:id', authenticate, reportsController.deleteReport.bind(reportsController));

// Records routes (protegidas)
router.get('/records', authenticate, recordsController.getAllRecords.bind(recordsController));
router.post('/records', authenticate, recordsController.createRecord.bind(recordsController));
router.get('/records/:id', authenticate, recordsController.getRecordById.bind(recordsController));
router.put('/records/:id', authenticate, recordsController.updateRecord.bind(recordsController));
router.delete('/records/:id', authenticate, recordsController.deleteRecord.bind(recordsController));

export default router;

export const setupRoutes = (app: Express) => {
	app.use('/api', router);
};