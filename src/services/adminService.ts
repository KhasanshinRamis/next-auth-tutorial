import { UserRole } from '@prisma/client';
import axios from 'axios';


class AdminService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/admin`;

	async get() {
		return axios.get<UserRole>(this.URL);
	};


};

export default new AdminService();