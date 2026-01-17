"use client";

import { Toaster } from "@/components/ui/sonner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useRealtimeNotifications } from "@/hooks/use-realtime";
import { CommandMenu } from "@/components/command-menu";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileBarChart,
    Settings,
    LogOut,
    Menu,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Tedarikçiler", href: "/suppliers" },
    { icon: Briefcase, label: "Projeler", href: "/projects" },
    { icon: FileBarChart, label: "Raporlar", href: "/reports" },
    { icon: Settings, label: "Ayarlar", href: "/settings" },
];

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        document.cookie = "f2s_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        router.push("/login");
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <PremiumHooks />
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex z-50">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        F2S System
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">v1.0.0 Premium</p>
                </div>

                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-4">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/25 font-medium"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Çıkış Yap
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger could go here */}
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {sidebarItems.find(i => i.href === pathname)?.label || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="relative text-slate-500">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-slate-800 shadow-md">
                            FA
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <ScrollArea className="flex-1 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                        {children}
                    </div>
                </ScrollArea>
                <CommandMenu />
                <Toaster />
            </main>
        </div>
    );
}

function PremiumHooks() {
    useKeyboardShortcuts();
    useRealtimeNotifications();
    return null;
}
