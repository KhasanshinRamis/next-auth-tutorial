import { RegisterSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';


class RegisterService {
	private URL = 'http://localhost:3000/api/register';

	async create(values: z.infer<typeof RegisterSchema> ) {
		return axios.post<z.infer<typeof RegisterSchema>>(this.URL, values);
	};


};

export default new RegisterService();