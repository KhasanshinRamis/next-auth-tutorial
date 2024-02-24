import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
	try {
		const jsonData = await req.json();
		const validatedFields = RegisterSchema.safeParse(jsonData);

		console.log(validatedFields);

		if (!validatedFields.success) {
			return NextResponse.json('Invalidated!', { status: 400 });
		};

		return NextResponse.json(validatedFields, { status: 200 });;

	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};