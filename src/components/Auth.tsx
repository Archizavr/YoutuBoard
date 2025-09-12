import type { Dispatch, SetStateAction } from "react";

import { LoginForm } from "./LoginForm";

import type { Page } from "@/types/types";

import { SpeedInsights } from "@vercel/speed-insights/react";

interface AuthProps {
    session?: Object | null;
    setSession?: Dispatch<SetStateAction<Object | null>>;
    setCurrentPage: Dispatch<SetStateAction<Page>>;
}

export default function Auth ({session, setSession, setCurrentPage} : AuthProps) {

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