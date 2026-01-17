"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Building2, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/lib/types";
import { useSuppliers } from "@/hooks/use-data";
import { Loader2 } from "lucide-react";

const columns: ColumnDef<Supplier>[] = [
    {
        accessorKey: "companyName",
        header: "Firma Adı",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{row.getValue("companyName")}</div>
                        <div className="text-xs text-slate-500">{row.original.officialName}</div>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => <Badge variant="secondary" className="capitalize">{row.getValue("category")}</Badge>
    },
    {
        accessorKey: "iban",
        header: "IBAN",
        cell: ({ row }) => <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{row.getValue("iban")}</span>
    },
    {
        accessorKey: "contact",
        header: "İletişim",
        cell: ({ row }) => {
            const contact = row.getValue("contact") as string;
            if (!contact) return <span className="text-slate-400 text-xs">-</span>;
            return (
                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full w-fit">
                    <Phone className="h-3 w-3" />
                    {contact}
                </div>
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
                        <DropdownMenuItem>Düzenle</DropdownMenuItem>
                        <DropdownMenuItem>Ödeme Geçmişi</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Pasif Yap</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function SuppliersPage() {
    const { suppliers, isLoading } = useSuppliers();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tedarikçiler</h2>
                    <p className="text-slate-500 text-sm">Tedarikçi veri tabanı ve IBAN yönetimi</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Tedarikçi Ekle
                </Button>
            </div>

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center border rounded-xl bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            ) : (
                <DataTable columns={columns} data={suppliers} searchKey="companyName" searchPlaceholder="Firma ara (örn: Koçtaş)..." />
            )}
        </div>
    );
}
