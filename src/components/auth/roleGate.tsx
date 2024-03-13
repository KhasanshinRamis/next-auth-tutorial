'use client';

import { useCurrentRole } from '@/hooks/useCurrentRole';
import { UserRole } from '@prisma/client';
import { ReactNode } from 'react';
import { FormError } from '@/components/formError';

interface RoleGateProps {
	children: ReactNode;
	allowedRole: UserRole;
}
export const RoleGate = ({ allowedRole, children } : RoleGateProps) => {
	const role = useCurrentRole();

	if (role !== allowedRole ) {
		return (
			<FormError message='You do not have permission to view this content!'/>
		);
	}

	return (
		<>
			{children}
		</>
	)
}