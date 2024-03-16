'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardWrapper } from '@/components/auth/cardWrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import loginService from '@/services/loginService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';


export const LoginForm = () => {

	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');
	const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with diferent provider!' : '';
	const router = useRouter();

	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string>('');

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { data, error } = useQuery({
		queryKey: ['login'],
		select: ({ data }) => {
			setErrorMessage(data.errorMessage),
				setSuccess(data.success)
		}
	});


	const mutation = useMutation({
		mutationKey: ['login'],
		mutationFn: (val: z.infer<typeof LoginSchema>) => loginService.create(val),
		onSuccess: (data: any) => {
			console.log('Success!', data);
			console.log(data.statusText);
			if (data.data.twoFactor) setShowTwoFactor(true);
			setSuccess(data.response.data.success);
			queryClient.invalidateQueries({ queryKey: ['login'] });
			if (callbackUrl) {
				router.push(callbackUrl);
			} else {
				router.push(`/settings`);
			}
		},
		onError: (error: any) => {
			console.log(error.message);
			setErrorMessage(error.response.data.error);
		}
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setErrorMessage('');
		setSuccess('');

		mutation.mutate({ ...values });
	};


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
						{showTwoFactor && (
							<>
								<FormField
									control={form.control}
									name='code'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Two Factor Code</FormLabel>
											<FormControl>
												<Input
													{...field}
													disabled={mutation.isPending}
													placeholder='123456'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						{!showTwoFactor && (
							<>
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
											<Button
												size='sm'
												variant='link'
												asChild
												className='px-0 font-normal'
											>
												<Link href='/auth/reset'>
													Forgot password?
												</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError message={errorMessage || urlError} />
					<FormSuccess message={success} />
					<Button
						type='submit'
						disabled={mutation.isPending}
						className='w-full'
					>
						{showTwoFactor ? 'Confirm' : 'Login'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};