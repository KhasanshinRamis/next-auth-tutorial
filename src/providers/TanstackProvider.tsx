'use client';

import { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


export const TanstackProvider = ({ children }: PropsWithChildren) => {
	const queryCLient = new QueryClient();
	return (
		<QueryClientProvider client={queryCLient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false}/>
		</QueryClientProvider>
	);
};