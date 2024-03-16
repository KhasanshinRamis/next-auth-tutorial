import * as z from 'zod';
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';



export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json();
		const validatedFields = RegisterSchema.safeParse(body);

		if (!validatedFields.success) {
			return NextResponse.json({ error: 'Invalidated!'}, { status: 401, statusText: 'Invalidated!' });
		};

		const { email, password, name } = validatedFields.data;
		const hashedPassword = await bcrypt.hash(password, 10);
		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			return NextResponse.json({ error: 'Email already in use!'}, {  status: 401, statusText: 'Email already in use!'});
		};

		await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,

			}
		})

		
		const verificationToken = await generateVerificationToken(email);
		await sendVerificationEmail(verificationToken.email, verificationToken.token);


		console.log('Confirmation email sent!');
		console.log(verificationToken);
		return NextResponse.json({success: 'Success! User create!'}, { status: 200 });;

	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};