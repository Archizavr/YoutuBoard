import { useNavigate } from "react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/AuthProvider";

export default function ForgotPassPage() {
  
  const {registerEmail, handleSubmitEmail, emailErrors, setForgotPass, isLoading, onForgotPasswordSubmit} = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-130 min-w-80 flex items-center justify-center text-2xl pt-7">
      <div className="w-full max-w-md">
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
                    onClick={() => {
                      setForgotPass(false)
                      navigate("/auth/login");
                    }}
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