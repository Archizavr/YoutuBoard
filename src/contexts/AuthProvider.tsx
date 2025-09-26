import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useNavigate } from "react-router";

import { useForm, type FieldErrors, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import supabase from "@/supabase-client";
import type { Session } from "@supabase/supabase-js";
import type { Page } from "@/types/types";

type FormSchemaType = { email: string; password: string; };

type EmailOnlySchemaType = {
  email: string;
};

interface AuthProps {
  register: UseFormRegister<FormSchemaType>;
  handleSubmit: UseFormHandleSubmit<FormSchemaType>;
  errors: FieldErrors<FormSchemaType>;
  registerEmail: UseFormRegister<EmailOnlySchemaType>;
  handleSubmitEmail: UseFormHandleSubmit<EmailOnlySchemaType>;
  emailErrors: FieldErrors<EmailOnlySchemaType>;
  serverError: string | null;
  setServerError: Dispatch<SetStateAction<string | null>>;
  session: Object | null;
  setSession: Dispatch<SetStateAction<Object | null>>;
  currentPage: Page;
  setCurrentPage: Dispatch<SetStateAction<Page>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  loginOrSignUp: "login" | "signup";
  setLoginOrSignUp: Dispatch<SetStateAction<"login" | "signup">>;
  loginUser: (data: FormSchemaType) => Promise<void>;
  signUpUser: (data: FormSchemaType) => Promise<void>;
  onSubmit: (data: FormSchemaType) => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  forgotPass: boolean;
  setForgotPass: Dispatch<SetStateAction<boolean>>;
  onForgotPasswordSubmit: () => Promise<void>;
}

export const AuthContext = createContext<AuthProps | undefined>(undefined);

const formSchema = z.object({
  email: z.email("Please enter a valid email").min(5, "Email must be at least 5 characters"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

const emailOnlySchema = z.object({
  email: z.email("Please enter a valid email").min(5, "Email must be at least 5 characters"),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [session, setSession] = useState<Object | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginOrSignUp, setLoginOrSignUp] = useState<"login" | "signup">("login");
  const [forgotPass, setForgotPass] = useState(false);

  const navigate = useNavigate();

  const insertUserInfo = async (session: Session | null) => {
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // console.log('🔄 Initializing auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        // console.log('📋 Initial session:', !!session, 'Error:', error);
        
        if (error) {
          // console.error('❌ Session error:', error);
          setSession(null);
          setCurrentPage('auth');
          navigate('/auth/login');
        } else if (session) {
          // console.log('✅ Session exists, setting dashboard...');
          setSession(session);
          setCurrentPage('dashboard');
          navigate('/app/dashboard');
          
          // Check the user in the background without blocking the UI
          setTimeout(async () => {
            try {
              // console.log('🔍 Background check for existing user...');
              const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('auth_id', session.user.id)
                .single();

              if (!existingUser) {
                // console.log('Creating user profile in background...');
                await insertUserInfo(session);
              }
            } catch (error) {
              // console.error('💥 Background user check error:', error);
            }
          }, 100);
          
        } else {
          // console.log('ℹ️ No session found');
          setSession(null);
          setCurrentPage('home');
          navigate('/');
        }
      } catch (error) {
        // console.error('💥 Auth initialization error:', error);
        setSession(null);
        setCurrentPage('auth');
        navigate('/auth/login');
      } finally {
        // console.log('🏁 Setting loading to false');
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    // Process only future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log('🔄 Auth state change:', event, !!session);
      
      // Ignore the initial events
      if (event === 'INITIAL_SESSION') {
        return;
      }
      
      if (event === 'SIGNED_OUT' || !session) {
        // console.log('👋 Signing out...');
        setSession(null);
        setCurrentPage('auth');
        navigate('/auth/login');
      } else if (event === 'SIGNED_IN') {
        // console.log('👋 New sign in...');
        setSession(session);
        setCurrentPage('dashboard');
        navigate('/app/dashboard');
        
        // Creating a user in the background
        setTimeout(async () => {
          try {
            const { data: existingUser } = await supabase
              .from('users')
              .select('id')
              .eq('auth_id', session.user.id)
              .single();

            if (!existingUser) {
              await insertUserInfo(session);
            }
          } catch (error) {
            // console.error('💥 User creation error:', error);
          }
        }, 100);
      } else if (event === 'TOKEN_REFRESHED') {
        // console.log('🔄 Token refreshed');
        setSession(session);
        // Do not change the currentPage when updating the token
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

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
      setServerError(error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      setServerError("Login failed. Try again.");
      throw new Error("Login failed. Try again.");
    }
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
      setServerError(error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      setServerError("Sign up failed. Try again.");
      throw new Error("Sign up failed. Try again.");
    }
    
    if (data.session && !error) {
      await insertUserInfo(data.session);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      if (loginOrSignUp === "signup") {
        await signUpUser({
          email: data.email,
          password: data.password,
        });
      } else {
        await loginUser({
          email: data.email,
          password: data.password,
        });
      }
      
      // If we get here, it was successful
      reset();
    } catch (error) {
      console.error("Auth error:", error);
      // Error is already set by loginUser/signUpUser
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

  const value = {
    register,
    handleSubmit,
    errors,
    registerEmail,
    handleSubmitEmail,
    emailErrors,
    serverError,
    setServerError,
    session,
    setSession,
    currentPage,
    setCurrentPage,
    isLoading,
    setIsLoading,
    loginOrSignUp,
    setLoginOrSignUp,
    loginUser,
    signUpUser,
    onSubmit,
    signUpWithGoogle,
    forgotPass,
    setForgotPass,
    onForgotPasswordSubmit
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};