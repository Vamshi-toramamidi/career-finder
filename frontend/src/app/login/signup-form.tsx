'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/mutli-select';
import jobRoles from '../../../public/job_roles.json';

function getJobRoleOptions() {
    const options: { value: string; label: string }[] = [];
    Object.keys(jobRoles).forEach((category) => {
        const roles = (jobRoles as Record<string, string[]>)[category];
        options.push(...roles.map((role: string) => ({ value: role, label: role })));
    });
    return options;
}

export default function SignupForm() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]); // array for MultiSelect
    const [resume, setResume] = useState(''); // resume as text (optional)
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [isValidFirstname, setIsValidfirstname] = useState(false);
    const [isValidLastname, setIsValidLastname] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    const jobRoleOptions = getJobRoleOptions();

    useEffect(() => {
        const nameRegex = /^[a-zA-Z]+$/;
        setIsValidfirstname(firstname.length > 0 && nameRegex.test(firstname));
    }, [firstname]);

    useEffect(() => {
        const nameRegex = /^[a-zA-Z]+$/;
        setIsValidLastname(lastname.length > 0 && nameRegex.test(lastname));
    }, [lastname]);

    useEffect(() => {
        const emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        setIsValidEmail(new RegExp(emailRegex).test(email));
    }, [email]);

    useEffect(() => {
        const hasNumber = /\d/;
        const hasLetter = /[a-zA-Z]/;
        const isLongEnough = password.length >= 8;
        setIsValidPassword(hasNumber.test(password) && hasLetter.test(password) && isLongEnough);
    }, [password]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            const res = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                    job_roles: selectedJobRoles,
                    resume: resume || null
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Signup successful!');
                setError('');
                // router.push('/dashboard')
            } else {
                setError(data.detail || '❌ Signup failed');
                setMessage('');
            }
        } catch (err) {
            setError('❌ Network error');
            setMessage('');
        }
    };

    return (
        <main className="flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        Create your account below
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" onClick={() => window.location.href = '/login'}>Log In</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="firstname">First Name</Label>
                            <Input
                                id="firstname"
                                type="text"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstname(e.target.value)}
                                required
                            />
                            {!isValidFirstname && firstname && (
                                <p className="text-red-500 text-xs">First name must contain only letters.</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                id="lastname"
                                type="text"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastname(e.target.value)}
                                required
                            />
                            {!isValidLastname && lastname && (
                                <p className="text-red-500 text-xs">Last name must contain only letters.</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                            />
                            {!isValidEmail && email && (
                                <p className="text-red-500 text-xs">Please enter a valid email address.</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                            />
                            {!isValidPassword && password && (
                                <p className="text-red-500 text-xs">Password must be at least 8 characters long and contain at least one letter and one number.</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Job Roles</Label>
                            <MultiSelect
                                options={jobRoleOptions}
                                selected={selectedJobRoles}
                                onChange={setSelectedJobRoles}
                                placeholder="Select job roles..."
                                emptyText="No job roles found."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="resume">Resume (Upload Resume here)</Label>
                            <Input
                                id="resume"
                                type="text"
                                placeholder="Paste your resume text here"
                                value={resume}
                                onChange={e => setResume(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        {message && <p className="text-green-600 text-xs mt-2">{message}</p>}
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button variant="outline" className="w-full" type="button">
                        Sign up with Google
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
