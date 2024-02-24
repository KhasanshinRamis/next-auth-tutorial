import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
	try {
		const validateFields = LoginSchema.safeParse(req.body);

		console.log(validateFields);
		return NextResponse.json(validateFields, { status: 200 })
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
};