"use client"

import { useEffect, useState } from "react";
import LoginForm from "@/app/login/login-form";
import SignupForm from "@/app/login/signup-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full flex justify-center mb-6">
            <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}