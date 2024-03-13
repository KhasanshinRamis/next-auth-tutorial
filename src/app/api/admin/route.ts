import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
	const role = await currentRole();

	if (role === UserRole.ADMIN) {
		return NextResponse.json(null, {status: 200});
	}

	return NextResponse.json(null, { status: 403 });
};