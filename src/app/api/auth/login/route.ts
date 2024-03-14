import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/token';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { getTwoFactorTokenByEmail } from '@/data/twoFactorToken';
import { db } from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from '@/data/twoFactorConfirmation';


export const POST = async (req: NextRequest) => {

	const jsonData = await req.json();
	const validatedFields = LoginSchema.safeParse(jsonData);


	if (!validatedFields.success) {
		return NextResponse.json("Invalid fields!", { status: 401 });
	}

	const { email, password, code } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return NextResponse.json("Email does not exist!", { status: 401, statusText: 'Email does not exist!' });
	};


	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(existingUser.email);
		await sendVerificationEmail(verificationToken.email, verificationToken.token);


		return NextResponse.json("Success! Conformation email sent!", { status: 200, statusText: 'Conformation email sent!' });
	};

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return NextResponse.json("Invalid code!", { status: 401, statusText: 'Invalid code!' });
			}

			if (twoFactorToken.token !== code) {
				return NextResponse.json("Invalid code!", { status: 401, statusText: 'Invalid code!' });
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return NextResponse.json("Code expired!", { status: 401, statusText: 'Invalid code!' });
			};

			const hasTwoFactorToken = await db.twoFactorToken.findFirst({
				where: { id: twoFactorToken.id }
			});

			if (hasTwoFactorToken) {
				await db.twoFactorToken.delete({
					where: { id: twoFactorToken.id }
				});
			};

			const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id }
				});
			};

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id
				}
			});

		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

			return NextResponse.json({ twoFactor: true }, { status: 200, statusText: 'Send 2FA' });
		}
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