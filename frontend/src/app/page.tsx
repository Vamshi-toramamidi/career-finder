'use client'; 
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const hello = "Hello, World!";
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/search')
      .then(res => res.json())
      .then(data => setJobs(data.jobs || []));
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to Career Finder</h1>
      <p className="mt-4 text-lg text-gray-700">
        Upload your resume and get matched with the perfect jobs.
      </p>
      <p>{hello}</p>
      <button onClick={handleLogin} className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Get Started
      </button>
      <div className="mt-10 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">Sample Jobs</h2>
        <ul className="space-y-4">
          {jobs.map((job: any) => (
            <li key={job.id} className="bg-white p-4 rounded shadow text-left">
              <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
              <p className="text-gray-800">{job.company} - {job.location}</p>
              <p className="text-gray-600 mt-2">{job.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
