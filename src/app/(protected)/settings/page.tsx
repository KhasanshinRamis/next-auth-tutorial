'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from '@/components/ui/form';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingsSchema } from '@/schemas';
import * as z from 'zod';
import settingsService from '@/services/settingsService';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserRole } from '@prisma/client';



export default function SettingsPage() {
	const { update } = useSession();
	const queryClient = useQueryClient();
	const user = useCurrentUser();

	const [success, setSuccess] = useState<string | undefined>('');
	const [errorMessage, setErrorMessage] = useState<string | undefined>('');

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
		}
	});

	const { data } = useQuery({
		queryKey: ['settings-data'],
		select: ({ data }) => {
			setErrorMessage(data.errorMessage),
				setSuccess(data.success)
		}
	});

	const mutation = useMutation({
		mutationKey: ['settings-mutation'],
		mutationFn: (val: z.infer<typeof SettingsSchema>) => settingsService.update(val),
		onSuccess: (data: any) => {
			console.log('Success!', data);
			console.log(data.success);
			setSuccess(data.success);
			update();
			queryClient.invalidateQueries({ queryKey: ['settings-data'] });
		},
		onError: (error: any) => {
			console.log(error.message);
			setErrorMessage(error.response.data.error);
			queryClient.invalidateQueries({ queryKey: ['settings-data'] });
		}
	});

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		mutation.mutate(values);
	};

	return (
		<Card className='w-[600px]'>
			<CardHeader>
				<p className='text-2xl font-semibold text-center'>
					⚙️Settings
				</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className='space-y-6'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Ivan Ivanov'
												disabled={mutation.isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
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
														placeholder='ivanivanov@gmail.com'
														type='email'
														disabled={mutation.isPending}
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
														placeholder='******'
														type='password'
														disabled={mutation.isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='******'
														type='password'
														disabled={mutation.isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
							<FormField
								control={form.control}
								name='role'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											disabled={mutation.isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue
														placeholder='Select a role'

													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={UserRole.ADMIN}>
													Admin
												</SelectItem>
												<SelectItem value={UserRole.USER}>
													User
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
								<>
									<FormField
										control={form.control}
										name='isTwoFactorEnabled'
										render={({ field }) => (
											<FormItem className='grid grid-flow-col items-center justify-between rounded-lg border p-3 shadow-sm'>
												<div className='space-y-0.5'>
													<FormLabel>Two Factor Authentication</FormLabel>
													<FormDescription>
														Enabled two factor authentication for you account
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														disabled={mutation.isPending}
														checked={field.value}
														onCheckedChange={field.onChange}
													>

													</Switch>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
						</div>
						<FormError message={errorMessage} />
						<FormSuccess message={success} />
						<Button
							type='submit'
							disabled={mutation.isPending}
						>
							Save
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
