"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Payment, Supplier } from "@/lib/types";
import { usePayments, useSuppliers } from "@/hooks/use-data";
import { Loader2 } from "lucide-react";

// Columns Definition
const createColumns = (suppliers: Supplier[]): ColumnDef<Payment>[] => [
    {
        accessorKey: "paymentDate", // Changed from date
        header: "Tarih",
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("paymentDate")}</span>
    },
    {
        accessorKey: "paymentItem", // Changed from item
        header: "Ödeme Kalemi",
    },
    {
        accessorKey: "supplierId",
        header: "Firma / Kişi",
        cell: ({ row }) => {
            const supplierId = row.getValue("supplierId") as string;
            const supplier = suppliers.find(s => s.id === supplierId);
            return <span className="font-medium">{supplier?.companyName || "Bilinmiyor"}</span>
        }
    },
    {
        accessorKey: "projectCode", // Changed from project
        header: "Proje",
        cell: ({ row }) => <Badge variant="outline" className="text-xs">{row.getValue("projectCode")}</Badge>
    },
    {
        accessorKey: "paidAmount", // Changed from amount
        header: "Tutar",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("paidAmount"));
            const currency = row.original.currency;
            const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "STG" ? "£" : "₺";

            return <div className="font-bold font-mono text-slate-700 dark:text-slate-200">{symbol}{amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
        }
    },
    {
        accessorKey: "status",
        header: "Durum",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge className={cn(
                    status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200" :
                        status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200" :
                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
                )}>
                    {status === "completed" ? "Ödendi" : status === "pending" ? "Bekliyor" : "Gecikmiş"}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuItem>Detaylar</DropdownMenuItem>
                        <DropdownMenuItem>Dekont Görüntüle</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Sil</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function PaymentsPage() {
    const { payments, isLoading: paymentsLoading } = usePayments({ limit: 100 });
    const { suppliers, isLoading: suppliersLoading } = useSuppliers();

    const isLoading = paymentsLoading || suppliersLoading;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ödemeler</h2>
                    <p className="text-slate-500 text-sm">Finansal hareketler ve ödeme takibi</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-200 dark:border-slate-800">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Excel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Ödeme
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center border rounded-xl bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            ) : (
                <DataTable columns={createColumns(suppliers)} data={payments} searchKey="paymentItem" searchPlaceholder="Ödeme ara..." />
            )}
        </div>
    );
}
