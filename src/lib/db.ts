import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}
// для того чтобы не перегружать создаём глобальный 
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;