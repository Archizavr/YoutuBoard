import { SpeedInsights } from "@vercel/speed-insights/react"
import { useEffect, useState } from "react";
import './App.css'

import { LoginForm, insertUserInfo } from "./components/LoginForm"
import { Sidebar } from "./components/SidebarMenu";
import { PageContent } from "./components/PageContent";
import { Header } from "./components/Header";
import { Loader } from "./components/Loader";

import type { Page } from './types/types';

import supabase from "./supabase-client";

function App() {
  const [session, setSession] = useState<Object | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
        } else if (session) {
          // console.log('✅ Session exists, setting dashboard...');
          setSession(session);
          setCurrentPage('dashboard');
          
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
          setCurrentPage('auth');
        }
      } catch (error) {
        // console.error('💥 Auth initialization error:', error);
        setSession(null);
        setCurrentPage('auth');
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
      } else if (event === 'SIGNED_IN') {
        // console.log('👋 New sign in...');
        setSession(session);
        setCurrentPage('dashboard');
        
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
  }, []);
  
  const handleSidebarToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSidebarClose = () => {
    setIsMenuOpen(false);
  };

  // Show table
  if (isLoading) {
    return (
      <Loader />
    );
  }

  // Проверяем аутентификацию
  const isAuthenticated = session && (session as any)?.user;

  if (isAuthenticated) {
    return (
      <div className="w-full">
        <div className="min-h-screen w-full bg-gradient-to-br flex">
          <Sidebar
            isOpen={isMenuOpen}
            onClose={handleSidebarClose}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <div className="flex-1 flex flex-col min-w-0 w-full">
            <Header
              currentPage={currentPage}
              onMenuClick={handleSidebarToggle}
            />
            <PageContent currentPage={currentPage} />
          </div>
        </div>
      </div>
    );
  }

  // Показываем форму логина
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center pt-8">
        <h1 className="text-4xl font-semibold font-sans pb-2">
          Welcome to YoutuBoard, great place to see your channel statistics!
        </h1>
      </div>
      <div className="flex items-start justify-center pt-4">
        <LoginForm 
          session={session} 
          setSession={setSession} 
          setCurrentPage={setCurrentPage} 
        />
      </div>
      <SpeedInsights />
    </div>
  );
}

export default App;