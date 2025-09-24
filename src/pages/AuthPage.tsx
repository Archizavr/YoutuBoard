import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthProvider";
import ForgotPassPage from "./ForgotPassPage";
import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";

export default function AuthPage() {
  const {register, handleSubmit, errors, serverError, session, isLoading, loginOrSignUp, setLoginOrSignUp, onSubmit, signUpWithGoogle, setForgotPass} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync state with current route
  useEffect(() => {
    if (location.pathname === "/auth/login") {
      setLoginOrSignUp("login");
      setForgotPass(false);
    } else if (location.pathname === "/auth/signup") {
      setLoginOrSignUp("signup");
      setForgotPass(false);
    } else if (location.pathname === "/auth/forgot-password") {
      setForgotPass(true);
      setLoginOrSignUp("login"); // Keep login state for when user goes back
    }
  }, [location.pathname, setLoginOrSignUp, setForgotPass]);

  // Show forgot password page if on forgot-password route
  if (location.pathname === "/auth/forgot-password") {
    return (
      <ForgotPassPage />
    );
  }

  // Login/Signup Form
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center pt-8">
          <h1 className="text-4xl font-semibold font-sans pb-2">
            Welcome to YoutuBoard, great place to see your channel statistics!
          </h1>
        </div>
        <div className="flex items-start justify-center pt-4">
          <div className="min-h-130 min-w-80 flex items-center justify-center text-2xl pt-7">
            <div className="w-full max-w-md">
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
                        <Label htmlFor="email" className="text-lg">Email</Label>
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
                            onClick={() => {
                              setLoginOrSignUp("signup");
                              navigate("/auth/signup");
                            }}
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
                              onClick={() => {
                                setLoginOrSignUp("login");
                                navigate("/auth/login");
                              }}
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
                            onClick={() => {
                              navigate("/auth/forgot-password");
                            }}
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
          </div>
      </div>
    );
  }
}