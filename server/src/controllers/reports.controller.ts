import { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service';

export class ReportsController {
    constructor(private reportsService: ReportsService = new ReportsService()) {}

    async createReport(req: Request, res: Response) {
        try {
            const reportData = req.body;
            const newReport = this.reportsService.createReport(reportData);
            res.status(201).json(newReport);
        } catch (error) {
            res.status(500).json({ message: 'Error creating report', error });
        }
    }

    async getAllReports(req: Request, res: Response) {
        try {
            const reports = this.reportsService.getAllReports();
            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching reports', error });
        }
    }

    async getReportById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const report = this.reportsService.getReportById(id);
            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching report', error });
        }
    }

    async updateReport(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const reportData = req.body;
            const updatedReport = this.reportsService.updateReport(id, reportData);
            if (!updatedReport) {
                return res.status(404).json({ message: 'Report not found' });
            }
            res.status(200).json(updatedReport);
        } catch (error) {
            res.status(500).json({ message: 'Error updating report', error });
        }
    }

    async deleteReport(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const deleted = this.reportsService.deleteReport(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Report not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting report', error });
        }
    }
}