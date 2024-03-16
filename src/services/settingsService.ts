import { SettingsSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';



class SettingsService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/settings`;

	async update(values: z.infer<typeof SettingsSchema>) {
		return axios.put<z.infer<typeof SettingsSchema>>(this.URL, values)
	}
}

export default new SettingsService();