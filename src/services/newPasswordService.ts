import { NewPasswordSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';

class NewPasswordService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/new-password`;

	async change(values: z.infer<typeof NewPasswordSchema>) {
		return axios.post<z.infer<typeof NewPasswordSchema>>(this.URL, values);
	};
}

export default new NewPasswordService();