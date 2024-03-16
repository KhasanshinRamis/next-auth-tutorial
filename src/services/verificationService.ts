import axios from 'axios';

class VerificationServices {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/new-verification`;

	async create(token: string | null) {
		return axios.post<string | null>(this.URL, {token});
	};
};

export default new VerificationServices();