import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDatabase = async (maxRetries = 10, delayMs = 2000): Promise<void> => {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			await prisma.$connect();
			return; // success
		} catch (err) {
			console.warn(`Prisma connection attempt ${attempt} failed:`, (err as Error).message);
			if (attempt === maxRetries) throw err;
			await new Promise((res) => setTimeout(res, delayMs));
		}
	}
};

export default prisma;