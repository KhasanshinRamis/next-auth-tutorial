import { UserRole } from '@prisma/client';
import axios from 'axios';


class AdminService {
	private URL = 'http://localhost:3000/api/admin';

	async get() {
		return axios.get<UserRole>(this.URL);
	};


};

export default new AdminService();