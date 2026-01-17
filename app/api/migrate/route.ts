import { NextResponse } from "next/server";
import { parseExcelData } from "@/utils/migration/excel-to-json";
import { getFileContent, updateFileContent } from "@/lib/github-api";
import { encryptData } from "@/lib/crypto";

export async function POST(request: Request) {
    try {
        // 1. Parse Excel
        const { suppliers, payments } = await parseExcelData();

        // 2. Push Suppliers to GitHub (Unencrypted)
        const suppliersSha = (await getFileContent("data/suppliers.json")).sha;
        await updateFileContent(
            "data/suppliers.json",
            suppliers,
            suppliersSha,
            "🚀 Migration: Initial suppliers import from Excel"
        );

        // 3. Push Payments to GitHub (Encrypted)
        const paymentsSha = (await getFileContent("data/payments.json")).sha;
        const encryptedPayments = { data: encryptData(payments) }; // Wrap in { data: ... }
        await updateFileContent(
            "data/payments.json",
            encryptedPayments,
            paymentsSha,
            "🚀 Migration: Initial payments import from Excel"
        );

        return NextResponse.json({
            success: true,
            message: `Migrated ${suppliers.length} suppliers and ${payments.length} payments.`,
            stats: {
                suppliers: suppliers.length,
                payments: payments.length
            }
        });

    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
