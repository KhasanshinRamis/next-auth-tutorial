import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';


export const PUT = async (req: NextRequest) => {
	try {
		const body: z.infer<typeof SettingsSchema> = await req.json();

		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized!' }, { status: 401, statusText: 'Unathorized!' });
		}

		const dbUser = await getUserById(user.id);

		if (!dbUser) {
			return NextResponse.json({ error: 'Unauthorized!' }, { status: 401, statusText: 'Unathorized!' });
		}


		if (user.isOAuth) {
			body.email = undefined;
			body.password = undefined;
			body.newPassword = undefined;
			body.isTwoFactorEnabled = undefined;
		}

		if (body.email && body.email !== user.email) {
			const existingUser = await getUserByEmail(body.email);

			if (existingUser && existingUser.id !== user.id) {
				return NextResponse.json({ error: 'Email already in use!' }, { status: 401, statusText: 'Email already in use!' });
			}

			const verificationToken = await generateVerificationToken(body.email);
			await sendVerificationEmail(verificationToken.email, verificationToken.token);

			return NextResponse.json({success: 'Verification email sent!'}, { status: 200, statusText: 'Verification email sent!' });

		}

		if (body.password && body.newPassword && dbUser.password) {
			const passwordMatch = await bcrypt.compare(
				body.password,
				dbUser.password
			);

			if (!passwordMatch) {
				return NextResponse.json({ error: 'Incorrect password!' }, { status: 401, statusText: 'Incorrect password!' });
			}

			const hashedPassword = await bcrypt.hash(body.newPassword, 10);

			body.password = hashedPassword;
			body.newPassword = undefined;
		}

		await db.user.update({
			where: { id: dbUser.id },
			data: {
				...body
			}
		});


		return NextResponse.json({success: 'Settings Uptadted!' }, { status: 200, statusText: 'Settings Uptadted!' });
	} catch (error: any) {
		return NextResponse.json(error.message, { status: 500, statusText: error.message });
	}

}