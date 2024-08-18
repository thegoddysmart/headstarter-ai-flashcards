'use client';

import { SignUp, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { signUp, isLoaded, isSignedIn } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/generate');
    }
  }, [isLoaded, isSignedIn, router]);

  return <SignUp path='/sign-up' />;
}
