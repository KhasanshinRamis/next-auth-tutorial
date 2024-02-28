import * as z from 'zod';
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/data/user';
import { genererateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';



export const POST = async (req: NextRequest) => {
	try {
		const jsonData = await req.json();
		const validatedFields = RegisterSchema.safeParse(jsonData);

		if (!validatedFields.success) {
			return NextResponse.json('Invalidated!', { status: 400 });
		};

		const { email, password, name } = validatedFields.data;
		const hashedPassword = await bcrypt.hash(password, 10);
		const existingUser = await getUserByEmail(email);

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

		
		const verificationToken = await genererateVerificationToken(email);
		await sendVerificationEmail(verificationToken.email, verificationToken.token);


		console.log('Confirmation email sent!');
		console.log(verificationToken);
		return NextResponse.json(newUser, { status: 200 });;

	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};