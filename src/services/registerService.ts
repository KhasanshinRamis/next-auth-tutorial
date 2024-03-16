import { RegisterSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';


class RegisterService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`;

	async create(values: z.infer<typeof RegisterSchema>) {
		return axios.post<z.infer<typeof RegisterSchema>>(this.URL, values);
	};


};

export default new RegisterService();