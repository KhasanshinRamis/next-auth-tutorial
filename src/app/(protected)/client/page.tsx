'use client';

import { UserInfo } from '@/components/userInfo';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { currentUser } from '@/lib/auth';


export default function ClientPage() {
	const user = useCurrentUser();

	return (
		<UserInfo label='📱 Client Component' user={user} />
	)
}