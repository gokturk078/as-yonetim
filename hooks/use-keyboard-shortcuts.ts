"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + Shift + P -> New Payment
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "P") {
                e.preventDefault();
                router.push("/payments?action=new");
            }

            // Cmd/Ctrl + Shift + S -> New Supplier
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "S") {
                e.preventDefault();
                router.push("/suppliers?action=new");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);
}
