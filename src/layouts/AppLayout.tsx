import { useState } from "react";

import { Header } from "@/components/Header";
import { Loader } from "@/components/Loader";
import { Sidebar } from "@/components/SidebarMenu";

import { useAuth } from "@/contexts/AuthProvider";

interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {currentPage, setCurrentPage, isLoading} = useAuth();

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
                    onMenuClick={handleSidebarToggle}
                    currentPage={currentPage}
                    />
                    {children}
                </div>
            </div>
        </div>
    );
}