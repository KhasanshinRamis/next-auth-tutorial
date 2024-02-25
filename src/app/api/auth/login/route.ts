import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export const POST = async (req: NextRequest) => {

	const jsonData = await req.json();
	const validatedFields = LoginSchema.safeParse(jsonData);


	if (!validatedFields.success) {
		return NextResponse.json("Invalid fields!", { status: 401 });
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
			redirect: true
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