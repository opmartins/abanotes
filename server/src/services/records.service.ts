import { PrismaClient } from '@prisma/client';

class RecordsService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createRecord(data: any) {
        return await this.prisma.record.create({
            data,
        });
    }

    async getRecordById(id: number) {
        return await this.prisma.record.findUnique({
            where: { id },
        });
    }

    async updateRecord(id: number, data: any) {
        return await this.prisma.record.update({
            where: { id },
            data,
        });
    }

    async deleteRecord(id: number) {
        return await this.prisma.record.delete({
            where: { id },
        });
    }

    async getAllRecords() {
        return await this.prisma.record.findMany();
    }
}

export default RecordsService;