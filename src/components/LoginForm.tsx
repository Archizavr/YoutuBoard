import { useState } from "react";
import { useForm } from 'react-hook-form';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";  
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { SessionProps } from "@/types/types";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import supabase from "../supabase-client";
import type { Session } from "@supabase/supabase-js";


const formSchema = z.object({
  email: z.email("Please enter a valid email").min(5, "Email must be at least 5 characters"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

const emailOnlySchema = z.object({
  email: z.email("Please enter a valid email").min(5, "Email must be at least 5 characters"),
});

export const insertUserInfo = async (session: Session | null) => {
  try {
    console.log('Inserting user info for:', session?.user?.id);
    
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert({
        auth_id: session?.user.id,
        email: session?.user.email,
        name: session?.user.user_metadata?.name || 'Guest_User',
        money_total_after_month: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting user:', insertError);
    } else {
      console.log('✅ User profile created:', insertData);
    }
  } catch (error) {
    console.error('💥 Insert user info error:', error);
  }
};

export function LoginForm({
  session, 
  setSession,
  ...props}: SessionProps) {
  
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginOrSignUp, setLoginOrSignUp] = useState<"login" | "signup">("login");
  const [forgotPass, setForgotPass] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Separate form for forgot password
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmail
  } = useForm<z.infer<typeof emailOnlySchema>>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: {
      email: "",
    },
  });

  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return {
        error: true,
        message: error.message,
      };
    }

    if (!data.user) {
      return {
        error: true,
        message: "Login failed. Try again.",
      };
    }

    return {
      success: true,
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  };

  const signUpUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    if (!data.user) {
      return {
        error: true,
        message: "Sign up failed. Try again.",
      };
    }
    
    if (data.session && !error) {
      await insertUserInfo(data.session);
    }

    return {
      success: true,
      message: "User created successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      let response;
      
      if (loginOrSignUp === "signup") {
        response = await signUpUser({
          email: data.email,
          password: data.password,
        });
      } else {
        response = await loginUser({
          email: data.email,
          password: data.password,
        });
      }

      if (response.error) {
        setServerError(response.message);
      } else {
        reset();
      }
    } catch (error) {
      console.error("Auth error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPasswordSubmit = async () => {
    // Simulate sending reset email
    alert("Password reset link has been sent to your email!");
    setForgotPass(false);
    resetEmail();
  };

  const signUpWithGoogle = async () => {
    try {
      setIsLoading(true);
      const {error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        setServerError(error.message);
        throw new Error(error.message)
      } else {
        reset();
      }
    } catch (error) {
      console.error("Google login error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Form
  if (forgotPass) {
    return (
      <div className="min-h-130 min-w-80 flex items-center justify-center text-2xl pt-7">
        <div className="w-full max-w-md" {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Reset your password</CardTitle>
              <CardDescription className="text-lg">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEmail(onForgotPasswordSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label className="text-lg" htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="something@example.com"
                      {...registerEmail("email")}
                      className={emailErrors.email ? "border-red-500" : ""}
                    />
                    {emailErrors.email && (
                      <p className="text-red-500 text-sm">{emailErrors.email.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full text-lg cursor-pointer" disabled={isLoading}>
                    {isLoading ? "Please wait..." : "Send Reset Link"}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setForgotPass(false)}
                      className="text-base text-blue-600 cursor-pointer hover:underline"
                    >
                      Back to login
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  if (!session) {
    return (
      <div className="min-h-130 min-w-80 flex items-center justify-center text-2xl pt-7">
        <div className="w-full max-w-md" {...props}>
          <Card>
            <CardHeader>
              <CardTitle>{loginOrSignUp === "signup" ? "Create an account" : "Login to your account"}</CardTitle>
              <CardDescription className="text-lg">
                Enter your email below to {loginOrSignUp === "signup" ? "create your account" : "login to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6 text-lg">
                  <div className="grid gap-3">
                    <Label htmlFor="email"className="text-lg">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="something@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-lg">Password</Label>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="●●●●●●●●"
                      {...register("password")}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                  </div>
                  {serverError && (
                    <p className="text-red-500 text-sm mt-2">{serverError}</p>
                  )}
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full text-lg cursor-pointer" disabled={isLoading}>
                      {isLoading ? (
                        "Please wait..."
                      ) : (
                        loginOrSignUp === "signup" ? "Sign Up" : "Login"
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full text-lg cursor-pointer" 
                      type="button" 
                      onClick={signUpWithGoogle}
                      disabled={isLoading}
                    >
                      {loginOrSignUp === "signup" ? "Sign up" : "Login"} with Google
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm">
                  {loginOrSignUp === "login" ? (
                    <div className="text-base">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setLoginOrSignUp("signup")}
                        className="text-base text-blue-600 cursor-pointer hover:underline"
                      >
                        Sign up
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-base">Already have an account?{" "}</div>
                      <button
                        type="button"
                        onClick={() => setLoginOrSignUp("login")}
                        className=" text-base text-blue-600 cursor-pointer hover:underline"
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
                
                {loginOrSignUp === "login" && (
                  <div className="mt-4 text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setForgotPass(true)}
                      className="text-base text-blue-600 cursor-pointer hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
