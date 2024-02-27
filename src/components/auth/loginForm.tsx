'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardWrapper } from '@/components/auth/cardWrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import loginService from '@/services/loginService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export const LoginForm = () => {


	const queryClient = useQueryClient();
	const router = useRouter();

	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string>('');

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { data } = useQuery({
		queryKey: ['create account'],
		select: ({ data }) => {
			setError(data.error),
			setSuccess(data.success)
		}
	})

	const mutation = useMutation({
		mutationKey: ['login'],
		mutationFn: (val: z.infer<typeof LoginSchema>) => loginService.create(val),
		onSuccess: (data) => {
			console.log('Success!', data);
			queryClient.invalidateQueries({ queryKey: ['login'] });
			setSuccess('Success!');
			router.push('/settings');
		}
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('');
		setSuccess('');

		mutation.mutate(values);
	}
	// const onSubmit = (values: z.infer<typeof LoginSchema>) => {
	// 	console.log(values);
	// 	setError("");
	// 	setSuccess("");

	// 	startTransition(() => {
	// 		login(values)
	// 			.then((data) => {
	// 				setError(data?.error);
	// 				setSuccess(data?.success);
	// 			});
	// 	});
	// }

	return (
		<CardWrapper
			headerLabel='Welcome back'
			backButtonLabel='Don`t have an account?'
			backButtonHref='/auth/register'
			showSocial
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
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={mutation.isPending}
											placeholder='******'
											type='password'
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
						Login
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};