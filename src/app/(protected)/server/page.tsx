import { UserInfo } from '@/components/userInfo';
import { currentUser } from '@/lib/auth';


export default async function ServerPage() {
	const user = await currentUser();

	return (
		<UserInfo label='💻 Server Component' user={user} />
	)
}