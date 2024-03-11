import { NewPasswordSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';

class NewPasswordService {
	private URL = 'http://localhost:3000/api/auth/new-password';

	async change(values: z.infer<typeof NewPasswordSchema>) {
		return axios.post<z.infer<typeof NewPasswordSchema>>(this.URL, values);
	};
}

export default new NewPasswordService();