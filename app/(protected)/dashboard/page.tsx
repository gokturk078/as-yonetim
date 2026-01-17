"use client";

import { CurrencyWidget } from "@/components/dashboard/CurrencyWidget";
import { PaymentTimeline } from "@/components/dashboard/PaymentTimeline";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { usePayments, useProjects } from "@/hooks/use-data";
import {
    CreditCard,
    TrendingUp,
    Wallet,
    AlertTriangle,
    Loader2
} from "lucide-react";

export default function DashboardPage() {
    const { payments, isLoading: paymentsLoading, isError: paymentsError } = usePayments({ limit: 1000 });
    const { projects, isLoading: projectsLoading, isError: projectsError } = useProjects();

    const isLoading = paymentsLoading || projectsLoading;

    // Calculate Stats
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const totalPaidThisMonth = payments
        .filter(p => p.paymentDate.startsWith(currentMonth) && p.status === 'completed')
        .reduce((sum, p) => sum + p.paidAmount, 0);

    const pendingPaymentsCount = payments.filter(p => p.status === 'pending').length;
    const totalDebt = payments.reduce((sum, p) => sum + p.currentMonthDebt, 0);
    const activeProjectsCount = projects ? projects.filter(p => p.status === 'active').length : 0;

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Error State - Ultra Professional
    if (paymentsError || projectsError) {
        return (
            <div className="flex flex-col h-[50vh] items-center justify-center space-y-4 text-center animate-in fade-in">
                <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Veri Alınamadı</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">
                        Sistem bağlantısında bir sorun oluştu veya Github API hız sınırı aşıldı. Lütfen 30-60 saniye bekleyip sayfayı yenileyin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Genel Bakış</h2>
                    <p className="text-slate-500 text-sm">Finansal durumunuzun anlık özeti</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Bu Ay Ödenen"
                    value={`₺${totalPaidThisMonth.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
                    change="+12.5%"
                    icon={CreditCard}
                    description="Geçen aya göre"
                    trend="up"
                />
                <StatsCard
                    title="Bekleyen Ödemeler"
                    value={pendingPaymentsCount.toString()}
                    change="Adet"
                    icon={AlertTriangle}
                    description="İşlem bekleyen"
                    trend={pendingPaymentsCount > 0 ? "down" : "neutral"}
                />
                <StatsCard
                    title="Toplam Güncel Borç"
                    value={`₺${totalDebt.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
                    change="-2.5%"
                    icon={Wallet}
                    description="Tüm projeler"
                    trend="down"
                />
                <StatsCard
                    title="Aktif Projeler"
                    value={activeProjectsCount.toString()}
                    change="Proje"
                    icon={TrendingUp}
                    description="Devam eden"
                    trend="up"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7 h-[400px]">
                <div className="col-span-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 h-full flex flex-col">
                        <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Son Ödemeler</h3>
                        <div className="flex-1 overflow-hidden">
                            <PaymentTimeline />
                        </div>
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CurrencyWidget />
                </div>
            </div>
        </div>
    );
}
