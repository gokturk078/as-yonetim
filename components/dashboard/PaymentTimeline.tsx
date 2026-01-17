import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarClock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const payments = [
    { id: 1, title: "SGK Ödemesi", company: "REPSAM", amount: "565.00", currency: "TL", status: "completed", date: "Bugün" },
    { id: 2, title: "Malzeme Alımı", company: "Koçtaş", amount: "12,500.00", currency: "TL", status: "pending", date: "Bugün" },
    { id: 3, title: "Kalıp İskelesi", company: "Doka", amount: "5,000", currency: "USD", status: "delayed", date: "Dün" },
    { id: 4, title: "Beton Dökümü", company: "Oyak", amount: "45,000.00", currency: "TL", status: "completed", date: "15 Jan" },
];

export function PaymentTimeline() {
    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    ÖDEME ZAMAN ÇİZELGESİ
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[300px] px-6">
                    <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6 py-4">
                        {payments.map((item, i) => (
                            <div key={item.id} className="mb-8 ml-6 relative group">
                                <span className={cn(
                                    "absolute flex items-center justify-center w-6 h-6 rounded-full -left-[37px] ring-4 ring-white dark:ring-slate-900 transition-colors",
                                    item.status === "completed" ? "bg-green-500" :
                                        item.status === "pending" ? "bg-amber-500" : "bg-red-500"
                                )}>
                                    {item.status === "completed" ? <CheckCircle2 className="w-3 h-3 text-white" /> :
                                        <AlertCircle className="w-3 h-3 text-white" />}
                                </span>

                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg group-hover:bg-slate-100 transition-colors">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</h4>
                                        <p className="text-xs text-slate-500">{item.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                                            {item.currency === "USD" ? "$" : item.currency === "EUR" ? "€" : "₺"}{item.amount}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded uppercase font-medium",
                                            item.status === "completed" ? "text-green-600 bg-green-100" :
                                                item.status === "pending" ? "text-amber-600 bg-amber-100" : "text-red-600 bg-red-100"
                                        )}>
                                            {item.status === "completed" ? "Ödendi" : item.status === "pending" ? "Bekliyor" : "Gecikmiş"}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 ml-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.date}</div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            {/* Footer action */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-xs font-semibold text-primary hover:text-accent transition-colors">TÜMÜNÜ GÖR</button>
            </div>
        </Card>
    );
}
