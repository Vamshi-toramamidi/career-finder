import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value || '';

  // if logged in, redirect to dashboard

  if (sessionToken) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold" >Welcome to Career Finder</h1>
      <p className="mt-4 text-lg">
        Upload your resume and get matched with the perfect jobs.
      </p>
      <Link href="/login" className="mt-6">
        <Button >
          Get Started
        </Button>
      </Link>
    </main>
  );
}
