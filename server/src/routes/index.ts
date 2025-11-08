import { Router, Express, Request, Response } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { RecordsController } from '../controllers/records.controller';

const router = Router();
const reportsController = new ReportsController();
const recordsController = new RecordsController();

// Healthcheck
router.get('/health', (_req: Request, res: Response) => {
	res.json({ status: 'ok' });
});

// Reports routes
router.get('/reports', reportsController.getAllReports.bind(reportsController));
router.post('/reports', reportsController.createReport.bind(reportsController));
router.get('/reports/:id', reportsController.getReportById.bind(reportsController));
router.put('/reports/:id', reportsController.updateReport.bind(reportsController));
router.delete('/reports/:id', reportsController.deleteReport.bind(reportsController));

// Records routes
router.get('/records', recordsController.getAllRecords.bind(recordsController));
router.post('/records', recordsController.createRecord.bind(recordsController));
router.get('/records/:id', recordsController.getRecordById.bind(recordsController));
router.put('/records/:id', recordsController.updateRecord.bind(recordsController));
router.delete('/records/:id', recordsController.deleteRecord.bind(recordsController));

export default router;

export const setupRoutes = (app: Express) => {
	app.use('/api', router);
};