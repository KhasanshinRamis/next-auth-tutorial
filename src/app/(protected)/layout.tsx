import { Navbar } from '@/components/layout/navbar';
import { ReactNode } from 'react';

interface ProtectedLayoutProps {
	children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
	return (
		<div className='w-full flex flex-col py-6 gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
			<Navbar />
			{children}
		</div>
	);
};
