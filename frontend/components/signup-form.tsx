'use client';

import { use, useEffect, useState } from 'react';

export default function SignupForm() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [isValidFirstname, setIsValidfirstname] = useState(false);
    const [isValidLastname, setIsValidLastname] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    useEffect(() => {
        const nameRegex = /^[a-zA-Z]+$/;
        setIsValidfirstname(firstname.length > 0);
        setIsValidfirstname(nameRegex.test(firstname));
    }, [firstname]);

    useEffect(() => {
        const nameRegex = /^[a-zA-Z]+$/;    
        setIsValidLastname(lastname.length > 0);
        setIsValidLastname(nameRegex.test(lastname))
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

        const res = await fetch('http://localhost:8000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                firstname,
                lastname,
                email,
                password,
            }),
        });

        const data = await res.json();

        console.log(data);

        if (res.ok) {
            setMessage(`Signup successful: User ID ${data.user_id}`);
            setError('');
            // You could redirect here if needed
            // router.push('/dashboard')
        } else {
            setError(`❌ ${data.detail}`);
            setMessage('');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-white">
            <form onSubmit={handleSignup} className="bg-gray-100 p-6 rounded shadow w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

                <input
                    type="firstname"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className="mb-2 p-2 w-full border rounded"
                />
                {!isValidFirstname && firstname && (
                    <p className="text-red-500 mb-2">First name must contain only letters.</p>
                )}

                <input
                    type="lastname"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => {setLastname(e.target.value)}}
                    required
                    className="mb-2 p-2 w-full border rounded"
                />
                {!isValidLastname && lastname && (
                    <p className="text-red-500 mb-2">Last name must contain only letters.</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mb-2 p-2 w-full border rounded"
                />

                {!isValidEmail && email && (
                    <p className="text-red-500 mb-2">Please enter a valid email address.</p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mb-2 p-2 w-full border rounded"
                />

                {!isValidPassword && password && (
                    <p className="text-red-500 mb-2">Password must be at least 8 characters long and contain at least one letter and one number.</p>
                )}

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Sign Up
                </button>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {message && <p className="text-green-600 mt-4">{message}</p>}
            </form>
        </main>
    );
}
