'use client';

import { CardWrapper } from '@/components/auth/cardWrapper';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BeatLoader } from 'react-spinners';
import verificationService from '@/services/verificationService';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { AxiosResponse } from 'axios';


export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const { data } = useQuery({
		queryKey: ['verification', token],
		select: ({ data }) => data
	});

	const query = async (token: string | null): Promise<AxiosResponse<string | null, any>> => {
		if (!token) {
		  return Promise.reject(new Error('Invalid token'));
		}
		
		try {
		  const response = await verificationService.create(token);
		  return response;
		} catch (error) {
		  return Promise.reject(error);
		}
	  };
	  
	  const mutation = useMutation({
		mutationKey: ['verification', token],
		mutationFn: query,
		onSuccess: (data: any) => {
		  console.log('Success!', data);
		  setSuccess(data.success);
		},
		onError: (error: any) => {
		  setError(error.response?.data?.error || 'An error occurred');
		  console.log(error.message);
		}
	  });


	  useEffect(() => {
		mutation.mutate(token);
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