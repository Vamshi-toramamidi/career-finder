'use client';

import { useState } from 'react'; // Importing useState from React to manage component state
// This component handles the login functionality for a user in a web application.

export default function LoginPage() {
  const [email, setEmail] = useState(''); // State to hold the email input
  const [password, setPassword] = useState(''); // State to hold the password input
  const [error, setError] = useState(''); // State to hold any error messages
  const [message, setMessage] = useState(''); // State to hold success messages

  const handleLogin = async (e: React.FormEvent) => { // Function to handle the login form submission
    e.preventDefault(); // Prevent the default form submission behavior

    const res = await fetch('http://localhost:8000/login', {
      method: 'POST', // Sending a POST request to the login endpoint
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Setting the content type to URL encoded form data
      },
      body: new URLSearchParams({ // Preparing the body of the request with email and password
        email, // Using the email state variable
        password, // Using the password state variable
      }),
    });

    const data = await res.json(); // Parsing the JSON response from the server

    if (res.ok) { // Checking if the response status is OK (200-299)
      setMessage(`Login successful: User ID ${data.user_id}`); // Setting a success message with the user ID returned from the server
      setError('');
      // You could redirect here if needed
      // router.push('/dashboard')
    } else {
      setError(`❌ ${data.detail}`); // Setting an error message if the login fails
      setMessage(''); // Clearing any previous success message
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleLogin} className="bg-gray-100 p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <input
          type="email" // Input field for the user's email
          placeholder="Email" // Placeholder text for the email input
          value={email} // Binding the input value to the email state variable
          onChange={(e) => setEmail(e.target.value)}  // Updating the email state variable on input change
          required // Making the email input required
          className="mb-2 p-2 w-full border rounded" // Styling the input field
        />

        <input
          type="password" // Input field for the user's password
          placeholder="Password" // Placeholder text for the password input
          value={password} // Binding the input value to the password state variable
          onChange={(e) => setPassword(e.target.value)} // Updating the password state variable on input change
          required // Making the password input required
          className="mb-2 p-2 w-full border rounded" // Styling the input field
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"> // Button to submit the form
          Log In
        </button> // Styling the button with Tailwind CSS classes

        {error && <p className="text-red-500 mt-4">{error}</p>} // Displaying any error messages in red text
        {message && <p className="text-green-600 mt-4">{message}</p>} // Displaying any success messages in green text
      </form>
    </main>
  );
}
