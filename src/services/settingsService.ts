import { SettingsSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';



class SettingsService {
	private URL = `http://localhost:3000/api/settings`;

	async update(values: z.infer<typeof SettingsSchema>) {
		return axios.put<z.infer<typeof SettingsSchema>>(this.URL, values)
	}
}

export default new SettingsService();