'use client';

import { CardWrapper } from '@/components/auth/cardWrapper';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BeatLoader } from 'react-spinners';
import verificationService from '@/services/verificationService';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';


export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const { data } = useQuery({
		queryKey: ['verification', token],
		select: ({ data }) => data
	});

	const query = useCallback((token: string) => {
		if (success || error) return;

		if (!token) {
			setError('Missing token!');
			return;
		};

		return verificationService.create(token);
	}, [token, success, error]);


	const mutation = useMutation({
		mutationKey: ['verification', token],
		mutationFn: query,
		onSuccess: (data) => {
			console.log('Success!', data);
			setSuccess(data.statusText);
			setError(undefined);

		},
		onError: (error) => {
			setError(error.response.data.error);
			console.log(error.message);
			setSuccess(undefined);
		}
	});


	useEffect(() => {
		mutation.mutate({ token: token });
	}, []);

	return (
		<CardWrapper
			headerLabel="Confirming your verification"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<div className="flex items-center w-full justify-center">
				{!success && !error && (
					<BeatLoader />
				)}
				<FormSuccess message={success} />
				{!success && (
					<FormError message={error} />
				)}
			</div>
		</CardWrapper>
	)
}