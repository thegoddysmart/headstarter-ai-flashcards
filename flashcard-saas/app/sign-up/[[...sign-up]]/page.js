'use client';

import { SignUp, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { isSignedIn } = useSignUp();
  const router = useRouter();

  if (isSignedIn) {
    router.push('/generate');
  }

  return <SignUp path='/sign-up' />;
}
