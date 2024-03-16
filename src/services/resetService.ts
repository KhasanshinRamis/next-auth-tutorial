import { ResetSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';

class ResetService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/reset`;

	async change(values: z.infer<typeof ResetSchema>) {
		return axios.post<z.infer<typeof ResetSchema>>(this.URL, values);
	};
}

export default new ResetService();