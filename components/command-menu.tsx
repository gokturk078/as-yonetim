"use client";

import * as React from "react";
import {
    Calendar,
    CreditCard,
    Settings,
    User,
    Calculator,
    Search,
    PlusCircle,
    LogOut,
    Building2,
    Briefcase
} from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    if (!mounted) return null;

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 md:hidden">
                <button
                    onClick={() => setOpen(true)}
                    className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full p-3 shadow-lg hover:scale-105 transition-transform"
                >
                    <Search className="w-6 h-6" />
                </button>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Bir komut yazın veya arayın..." />
                <CommandList>
                    <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
                    <CommandGroup heading="Hızlı İşlemler">
                        <CommandItem onSelect={() => runCommand(() => router.push("/payments"))}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>Yeni Ödeme Ekle</span>
                            <CommandShortcut>⌘N</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/suppliers"))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Tedarikçi Ekle</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Gezinti">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/payments"))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Ödemeler</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/suppliers"))}>
                            <Building2 className="mr-2 h-4 w-4" />
                            <span>Tedarikçiler</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/projects"))}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Projeler</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Ayarlar</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Hesap">
                        <CommandItem onSelect={() => runCommand(() => {
                            logout();
                            document.cookie = "f2s_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                            router.push("/login");
                        })}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Çıkış Yap</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
