'use client';

import { RoleGate } from '@/components/auth/roleGate';
import { FormSuccess } from '@/components/formSuccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import adminService from '@/services/adminService';
import { UserRole } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';


export default function AdminPage() {

	const { data, isSuccess, isError } = useQuery({
		queryKey: ['admin'],
		queryFn: () => adminService.get(),
		select: ({ data }) => data,
	})

	if (isSuccess) toast.success('Allowed API Route!');
	if (isError) toast.error('Forbidden API Route!');


	return (
		<Card className='w-[600px]'>
			<CardHeader>
				<p className='text-2xl font-semibold text-center'>
					🔑Admin
				</p>
			</CardHeader>
			<CardContent className='space-y-4'>
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message='You are allowed to see this content!' />
				</RoleGate>
			</CardContent>
			<div className='grid grid-flow-col items-center justify-between rounded-lg border p-3 shadow-md'>
				<p className='text-sm font-medium'>
					Admin-only API Route
				</p>
				<Button onClick={() => data}>
					Click to test
				</Button>
			</div>
			<div className='grid grid-flow-col items-center justify-between rounded-lg border p-3 shadow-md'>
				<p className='text-sm font-medium'>
					Admin-only Server Action
				</p>
				<Button>
					Click to test
				</Button>
			</div>
		</Card>
	)
}