'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardWrapper } from '@/components/auth/cardWrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ResetSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import resetService from '@/services/resetService';


export const ResetForm = () => {

	const queryClient = useQueryClient();

	const [error, setError] = useState<string | undefined | Error>('');
	const [success, setSuccess] = useState<string>('');

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	const { data } = useQuery({
		queryKey: ['forgot'],
		select: ({ data }) => {
			setError(data.error),
				setSuccess(data.success)
		}
	});

	const mutation = useMutation({
		mutationKey: ['login'],
		mutationFn: (val: z.infer<typeof ResetSchema>) => resetService.changePassword(val),
		onSuccess: (data) => {
			console.log('Success!', data);
			console.log(data.statusText);
			setSuccess(data.statusText);
			queryClient.invalidateQueries({ queryKey: ['forgot'] });
		},
		onError: (error) => {
			setError(error.message);
			console.log(error.message);
		}
	});

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		setError('');
		setSuccess('');


		mutation.mutate(values);
	};


	return (
		<CardWrapper
			headerLabel='Forgot your password?'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={mutation.isPending}
											placeholder='ivanovivan@example.com'
											type='email'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						type='submit'
						disabled={mutation.isPending}
						className='w-full'
					>
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};