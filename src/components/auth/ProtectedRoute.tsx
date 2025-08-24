"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const sessionUser = sessionStorage.getItem('user');
        const localUser = localStorage.getItem('user');
        
        if (!sessionUser && !localUser) {
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router]);

  // Tampilkan loading spinner saat checking auth
  const sessionUser = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const localUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  if (!sessionUser && !localUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}