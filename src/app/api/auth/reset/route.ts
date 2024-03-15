import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/token';
import { ResetSchema } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';



export const POST = async (req: NextRequest) => {

	const body = await req.json();

	const validatedFields = ResetSchema.safeParse(body);
	if (!validatedFields.success) return NextResponse.json({ error: 'Invalid fields!' }, { status: 401, statusText: 'Invalid fields!' });

	const { email } = validatedFields.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser) return NextResponse.json({ error: 'Email not found!' }, { status: 401, statusText: 'Email not found!' });

	const passwordResetToken = await generatePasswordResetToken(email);

	await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

	return NextResponse.json('Reset email sent!', { status: 200, statusText: 'Reset email sent!' });
}
