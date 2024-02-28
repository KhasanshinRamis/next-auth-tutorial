import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getUserByEmail } from '@/data/user';
import { genererateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';

export const POST = async (req: NextRequest) => {

	const jsonData = await req.json();
	const validatedFields = LoginSchema.safeParse(jsonData);


	if (!validatedFields.success) {
		return NextResponse.json("Invalid fields!", { status: 401 });
	}

	const { email, password } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return NextResponse.json("Email does not exist!", { status: 401 });
	};

	if(!existingUser.emailVerified) {
		const verificationToken = await genererateVerificationToken(existingUser.email);
		await sendVerificationEmail(verificationToken.email, verificationToken.token);

		console.log('Success! Conformation email sent!');
	};


	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT
		});
	} catch (error: any) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return NextResponse.json("Invalid credentials!", { status: 401 });
				default:
					return NextResponse.json("Something went wrong!", { status: 401 });
			}
		}

		throw error;
	}
};