import { LoginSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';


class LoginService {
	private URL = 'http://localhost:3000/api/auth/login';

	async create(values: z.infer<typeof LoginSchema> ) {
		return axios.post<z.infer<typeof LoginSchema>>(this.URL, values);
	};


};

export default new LoginService();