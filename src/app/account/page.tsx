"use client"
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

const AccountPage = () => {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/sign-in';
    }
  }, [isSignedIn]);

  return <div>Account Page Content</div>;
};

export default AccountPage;
