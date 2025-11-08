import { Request, Response } from 'express';
import RecordsService from '../services/records.service';

export class RecordsController {
    constructor(private recordsService: RecordsService = new RecordsService()) {}

    async createRecord(req: Request, res: Response) {
        try {
            const recordData = req.body;
            const newRecord = await this.recordsService.createRecord(recordData);
            res.status(201).json(newRecord);
        } catch (error) {
            res.status(500).json({ message: 'Error creating record', error });
        }
    }

    async getAllRecords(req: Request, res: Response) {
        try {
            const records = await this.recordsService.getAllRecords();
            res.status(200).json(records);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching records', error });
        }
    }

    async getRecordById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const record = await this.recordsService.getRecordById(id);
            if (!record) {
                return res.status(404).json({ message: 'Record not found' });
            }
            res.status(200).json(record);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching record', error });
        }
    }

    async updateRecord(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const recordData = req.body;
            const updatedRecord = await this.recordsService.updateRecord(id, recordData);
            if (!updatedRecord) {
                return res.status(404).json({ message: 'Record not found' });
            }
            res.status(200).json(updatedRecord);
        } catch (error) {
            res.status(500).json({ message: 'Error updating record', error });
        }
    }

    async deleteRecord(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const deletedRecord = await this.recordsService.deleteRecord(id);
            if (!deletedRecord) {
                return res.status(404).json({ message: 'Record not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting record', error });
        }
    }
}