import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ResumeUploadForm from './resume-upload-form';

export default async function Dashboard() {
  // Get all cookies as an array and find session_token
  const cookieStore = await cookies();
  let sessionToken = '';
  if (typeof cookieStore.getAll === 'function') {
    const allCookies = cookieStore.getAll();
    const sessionCookie = allCookies.find((c: any) => c.name === 'session_token');
    sessionToken = sessionCookie ? sessionCookie.value : '';
  } else if (typeof cookieStore.get === 'function') {
    const sessionCookie = cookieStore.get('session_token');
    sessionToken = sessionCookie ? sessionCookie.value : '';
  }
  const cookieHeader = sessionToken ? `session_token=${sessionToken}` : '';

  // Fetch user session info from backend
  const res = await fetch('http://localhost:8000/auth/me', {
    headers: {
      Cookie: cookieHeader,
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (res.status !== 200) {
    redirect('/login');
  }

  const user = await res.json();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="mb-4 text-lg text-green-700">
        Welcome, {user.firstname} {user.lastname}
      </div>
      <div className="w-full max-w-xl">
        <ResumeUploadForm />
      </div>
    </main>
  )
}