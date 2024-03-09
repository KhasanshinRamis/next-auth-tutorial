import { NextRequest } from 'next/server';
import * as z from 'zod';
import { NewPasswordSchema } from '@/schemas';


export const POST = async (req: NextRequest) => {
	const body = await req.json();

	console.log(body);

}