"use client"

import { useState } from "react";
import LoginForm from "../../../components/login-form";
import { Sign } from "crypto";
import SignupForm from "../../../components/signup-form";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* toggle between login and signup */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-l-lg ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-r-lg ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Sign Up
          </button>
          </div>
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}
      </div>
    </div>
  );
}