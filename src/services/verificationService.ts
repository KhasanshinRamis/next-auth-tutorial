import axios from 'axios';

class VerificationServices {
	private URL = 'http://localhost:3000/api/auth/new-verification';

	async create(token: string) {
		return axios.post<string | null>(this.URL, token);
	};
};

export default new VerificationServices();