export class ReportsService {
    private reports: any[] = []; // Array to store reports temporarily

    // Method to create a new report
    public createReport(reportData: any): any {
        const newReport = { id: this.reports.length + 1, ...reportData };
        this.reports.push(newReport);
        return newReport;
    }

    // Method to get all reports
    public getAllReports(): any[] {
        return this.reports;
    }

    // Method to get a report by ID
    public getReportById(reportId: number): any | undefined {
        return this.reports.find(report => report.id === reportId);
    }

    // Method to update a report
    public updateReport(reportId: number, updatedData: any): any | undefined {
        const reportIndex = this.reports.findIndex(report => report.id === reportId);
        if (reportIndex !== -1) {
            this.reports[reportIndex] = { ...this.reports[reportIndex], ...updatedData };
            return this.reports[reportIndex];
        }
        return undefined;
    }

    // Method to delete a report
    public deleteReport(reportId: number): boolean {
        const reportIndex = this.reports.findIndex(report => report.id === reportId);
        if (reportIndex !== -1) {
            this.reports.splice(reportIndex, 1);
            return true;
        }
        return false;
    }
}