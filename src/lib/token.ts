import { getPasswordResetTokenByEmail } from '@/data/passwordReset';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const generatePasswordResetToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getPasswordResetTokenByEmail(email);
	

	if (existingToken) {
		await db.passwordResetToken.delete({
			where: {id: existingToken.id}
		});
	};


	const resetPasswordToken = await db.passwordResetToken.create({
		data: {
			email,
			token,
			expires
		}
	});

	return resetPasswordToken;
};

export const genererateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await db.verificationToken.delete({
			where: {id: existingToken.id}
		});
	};

	const verificationToken = await db.verificationToken.create({
		data: {
			email,
			token,
			expires
		}
	});

	return verificationToken;
};