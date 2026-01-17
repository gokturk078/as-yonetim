"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, TrendingUp } from "lucide-react";

interface Rate {
    buy: number;
    sell: number;
}
interface Rates {
    [key: string]: Rate;
}

export function CurrencyWidget() {
    const [rates, setRates] = useState<Rates | null>(null);
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/exchange-rate");
            const data = await res.json();
            setRates(data.rates);
            setDate(data.date);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 300000); // 5 min
        return () => clearInterval(interval);
    }, []);

    if (loading && !rates) {
        return (
            <Card className="h-full border-none shadow-sm animate-pulse bg-white/50">
                <CardHeader><div className="h-4 bg-slate-200 rounded w-1/3"></div></CardHeader>
                <CardContent><div className="h-20 bg-slate-200 rounded"></div></CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full border-none shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                    GÜNLÜK KURLAR ({date})
                </CardTitle>
                <RefreshCw
                    className={`h-4 w-4 text-slate-400 cursor-pointer hover:text-primary transition-colors ${loading ? "animate-spin" : ""}`}
                    onClick={fetchRates}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {rates && Object.entries(rates).map(([currency, values]) => (
                        <div key={currency} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg font-bold text-slate-700 dark:text-slate-200 w-12 text-center">
                                    {currency}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">ALIŞ</span>
                                    <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
                                        ₺{values.buy.toFixed(4)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">SATIŞ</span>
                                    <span className="font-mono font-bold text-primary dark:text-primary-foreground">
                                        ₺{values.sell.toFixed(4)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span>TCMB verileri anlık güncellenir.</span>
                </div>
            </CardContent>
        </Card>
    );
}
