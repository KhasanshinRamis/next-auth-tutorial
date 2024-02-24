import * as z from 'zod';
import bcrypts from 'bcrypt';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { getUsersByEmail } from '@/data/user';

export const POST = async (req: NextRequest) => {
	try {
		const jsonData = await req.json();
		const validatedFields = RegisterSchema.safeParse(jsonData);

		if (!validatedFields.success) {
			return NextResponse.json('Invalidated!', { status: 400 });
		};

		const { email, password, name } = validatedFields.data;
		const hashedPassword = await bcrypts.hash(password, 10);
		const existingUser = await getUsersByEmail(email);

		if (existingUser) {
			return NextResponse.json('Email already in use!', { statusText: 'Email already in use!', status: 400 });
		};

		const newUser = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,

			}
		})

		// TODO: Send verification token email

		return NextResponse.json(newUser, { status: 200 });;

	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};