import { ReportsService } from '../src/services/reports.service';
import { ReportsController } from '../src/controllers/reports.controller';

describe('ReportsController', () => {
    let reportsController: ReportsController;
    let reportsService: ReportsService;

    beforeEach(() => {
        reportsService = new ReportsService();
        reportsController = new ReportsController(reportsService);
    });

    it('should create a report', async () => {
        const reportData = { title: 'Test Report', content: 'This is a test report.' };
        jest.spyOn(reportsService, 'createReport').mockResolvedValue(reportData);

        const result = await reportsController.createReport(reportData);

        expect(result).toEqual(reportData);
        expect(reportsService.createReport).toHaveBeenCalledWith(reportData);
    });

    it('should get all reports', async () => {
        const reports = [{ title: 'Test Report 1' }, { title: 'Test Report 2' }];
        jest.spyOn(reportsService, 'getAllReports').mockResolvedValue(reports);

        const result = await reportsController.getAllReports();

        expect(result).toEqual(reports);
        expect(reportsService.getAllReports).toHaveBeenCalled();
    });

    it('should get a report by id', async () => {
        const reportId = '1';
        const report = { id: reportId, title: 'Test Report' };
        jest.spyOn(reportsService, 'getReportById').mockResolvedValue(report);

        const result = await reportsController.getReportById(reportId);

        expect(result).toEqual(report);
        expect(reportsService.getReportById).toHaveBeenCalledWith(reportId);
    });

    it('should update a report', async () => {
        const reportId = '1';
        const updatedData = { title: 'Updated Report' };
        const updatedReport = { id: reportId, ...updatedData };
        jest.spyOn(reportsService, 'updateReport').mockResolvedValue(updatedReport);

        const result = await reportsController.updateReport(reportId, updatedData);

        expect(result).toEqual(updatedReport);
        expect(reportsService.updateReport).toHaveBeenCalledWith(reportId, updatedData);
    });

    it('should delete a report', async () => {
        const reportId = '1';
        jest.spyOn(reportsService, 'deleteReport').mockResolvedValue(true);

        const result = await reportsController.deleteReport(reportId);

        expect(result).toBe(true);
        expect(reportsService.deleteReport).toHaveBeenCalledWith(reportId);
    });
});