"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { usePayments } from "./use-data";

export function useRealtimeNotifications() {
    // Only run on client
    // Simulate real-time by checking if data count changes massively or just mock random events for "Premium Feel"
    // In a real app, this would be WebSocket or polling output

    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly trigger a notification for demo purposes
            // 2% chance every 10 seconds
            if (Math.random() < 0.05) {
                toast.info("💸 Sistem Güncellemesi", {
                    description: "TCMB kurları güncellendi.",
                    action: {
                        label: "Yenile",
                        onClick: () => window.location.reload()
                    }
                });
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);
}
