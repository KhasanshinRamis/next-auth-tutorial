import { Header } from '@/components/auth/header';
import { BackButton } from '@/components/auth/backButton';
import { Card, CardHeader, CardFooter } from '@/components/ui/card';
import { CardWrapper } from '@/components/auth/cardWrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';


export const ErrorCard = () => {
	return (
		<CardWrapper
			headerLabel='Oooops! Something went wrong!'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<div className='w-full grid justify-center items-center'>
				<ExclamationTriangleIcon className='text-destructive' />
			</div>
		</CardWrapper>
	);
};