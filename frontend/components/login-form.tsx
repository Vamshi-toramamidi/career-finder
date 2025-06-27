'use client';

import { useEffect, useState } from 'react'; // Importing useState from React to manage component state
// This component handles the login functionality for a user in a web application.

export default function LoginForm() {
  const [email, setEmail] = useState(''); // State to hold the email input
  const [password, setPassword] = useState(''); // State to hold the password input
  const [error, setError] = useState(''); // State to hold any error messages
  const [message, setMessage] = useState(''); // State to hold success messages

  const [isValidEmail, setIsValidEmail] = useState(false); // State to hold the validity of the email input
  const [isValidPassword, setIsValidPassword] = useState(false); // State to hold the validity of the password input


  useEffect(() => {
    // Regular expression to validate email format
    const emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; // Regex pattern for validating email format
    setIsValidEmail(new RegExp(emailRegex).test(email)); // Testing the email against the regex pattern and updating the state

  }, [email]); // This effect runs whenever the email state changes

  // password should be at least 8 characters long and contain at least one number and one letter
  useEffect(() => {
    // individual checks for password validity
    const hasNumber = /\d/; // Regular expression to check for at least one digit
    const hasLetter = /[a-zA-Z]/; // Regular expression to check for at least one letter
    const isLongEnough = password.length >= 8; // Check if the password is at least 8 characters long
    setIsValidPassword(hasNumber.test(password) && hasLetter.test(password) && isLongEnough); // Update the state based on the combined validity checks
  }, [password]); // This effect runs whenever the password


  

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

        {!isValidEmail && email && ( // Conditional rendering to show an error if the email is invalid
          <p className="text-red-500 mb-2">Please enter a valid email address.</p>
        )}

        <input
          type="password" // Input field for the user's password
          placeholder="Password" // Placeholder text for the password input
          value={password} // Binding the input value to the password state variable
          onChange={(e) => setPassword(e.target.value)} // Updating the password state variable on input change
          required // Making the password input required
          className="mb-2 p-2 w-full border rounded" // Styling the input field
        />

        {!isValidPassword && password && ( // Conditional rendering to show an error if the password is invalid
          <p className="text-red-500 mb-2">Password must be at least 8 characters long and contain at least one letter and one number.</p>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Log In
        </button> 

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {message && <p className="text-green-600 mt-4">{message}</p>}
      </form>
    </main>
  );
}
