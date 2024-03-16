import { getPasswordResetTokenByToken } from '@/data/passwordReset';
import { getUserByEmail } from '@/data/user';
import { NewPasswordSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';


export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json();

		console.log(body);

		const validatedFields = NewPasswordSchema.safeParse(body);
		console.log('validatedFields', validatedFields);
		console.log('validatedFields.success', validatedFields.success);
		
		if (!validatedFields.success) {
			return NextResponse.json({ error: "Invalid fields!" }, { status: 401, statusText: "Invalid fields!" });
		};

		const { password, token } = validatedFields.data;

		const existingToken = await getPasswordResetTokenByToken(token);
		if (!existingToken) {
			return NextResponse.json({ error: "Invalid token!" }, { status: 401, statusText: 'Invalid token!' });
		};

		const hasExpired = new Date(existingToken.expires) < new Date();
		if (hasExpired) {
			return NextResponse.json({ error: "Token has expired!" }, { status: 401, statusText: 'Token has expired!' });
		};

		const existingUser = await getUserByEmail(existingToken.email);
		if (!existingUser) {
			return NextResponse.json({ error: "Email does not exist" }, { status: 401, statusText: 'Email does not exist!' });
		};

		const hashedPassword = await bcrypt.hash(password, 10);

		console.log(hashedPassword);

		await db.user.update({
			where: { id: existingUser.id },
			data: { password: hashedPassword },
		});

		await db.passwordResetToken.delete({
			where: { id: existingToken.id },
		});

		return NextResponse.json("Password updated!", { status: 200, statusText: 'Password updated!' });
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	};
}