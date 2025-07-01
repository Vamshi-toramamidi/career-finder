"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState(""); // State to hold the email input
  const [password, setPassword] = useState(""); // State to hold the password input
  const [error, setError] = useState(""); // State to hold any error messages
  const [message, setMessage] = useState(""); // State to hold success messages

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
    setIsValidPassword(
      hasNumber.test(password) &&
        hasLetter.test(password) &&
        isLongEnough
    ); // Update the state based on the combined validity checks
  }, [password]); // This effect runs whenever the password

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Function to handle the login form submission
    e.preventDefault(); // Prevent the default form submission behavior
    setError(""); // Clearing any previous error message
    setMessage(""); // Clearing any previous success message
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST", // Sending a POST request to the login endpoint
        headers: {
          "Content-Type": "application/json", // Setting the content type to JSON
        },
        credentials: "include", // Including credentials in the request
        body: JSON.stringify({ email, password }), // Sending the email and password as JSON
      });
      const data = await res.json();
      if (res.ok) {
        // Checking if the response status is OK (200-299)
        setMessage("Login successful! Redirecting..."); // Setting a success message
        router.push("/dashboard"); // Redirect to dashboard after successful login
      } else {
        setError(data.detail || data.message || "❌ Login failed");
      }
    } catch (err) {
      setError("❌ Network error"); // Setting a network error message in case of a fetch error
    }
  };

  return (
    <main className="flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/signup")}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {!isValidEmail && email && (
                <p className="text-red-500 text-xs">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isValidPassword && password && (
                <p className="text-red-500 text-xs">
                  Password must be at least 8 characters long and contain at least
                  one letter and one number.
                </p>
              )}
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            {message && (
              <p className="text-green-600 text-xs mt-2">{message}</p>
            )}
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
