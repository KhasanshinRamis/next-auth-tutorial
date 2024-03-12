'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { signOut } from 'next-auth/react';


export default function SettingsPage() {
	const user = useCurrentUser();


	const onClick = () => {
		signOut();
	};

	return (
		<div className='bg-white p-10 rounded-xl'>
			<button onClick={onClick} type="submit">
				Sign out
			</button>
		</div>
	);
}
