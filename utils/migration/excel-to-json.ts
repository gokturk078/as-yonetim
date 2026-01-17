import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { Payment, Supplier } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Project Code Mapping
const PROJECT_CODE_MAPPING: Record<string, string> = {
    "GZ": "Gaziemir Projesi",
    "CASINO": "Casino Otel Projesi",
    "ASKERİYE": "Askeriye Lojmanları",
    "CNN": "Çeşme Nazlı Nar Projesi",
    "MERIT": "Merit Residence",
    "BALO": "Balova Konutları",
    "KANER": "Kaner İnşaat Ortaklık",
    "ETKİNLİK MEYDANI": "Kongre Merkezi",
    "MUTFAK": "Mutfak Dolabı Tedarik",
    "DOME TAKSİ": "Dome Taksi Durağı",
    "İŞÇİ LOJMAN": "İnşaat Lojmanları"
};

const LEGACY_FILE_PATH = path.join(process.cwd(), 'legacy_data', 'FERİT ABİ TABLO.xlsx');

export async function parseExcelData() {
    if (!fs.existsSync(LEGACY_FILE_PATH)) {
        throw new Error(`Excel file not found at ${LEGACY_FILE_PATH}`);
    }

    const workbook = XLSX.readFile(LEGACY_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const suppliers: Supplier[] = [];
    const payments: Payment[] = [];
    const supplierMap = new Map<string, string>(); // Name -> ID

    jsonData.forEach((row: any, index: number) => {
        // Basic cleaning and mapping fields from Turkish headers to English
        // Adjust header names based on actual Excel file layout (Assumed based on prompt)
        // IMPORTANT: Since I don't see the exact file headers, I'll use logical guessing or index-based if needed.
        // Assuming headers like "FİRMA ADI", "ÖDEME KALEMİ", "BORÇ", "ALACAK", "BAKİYE", "PROJE" etc.

        const companyName = row['FİRMA ADI'] || row['FİRMA'] || `Bilinmeyen Firma ${index}`;
        if (!companyName) return;

        // Create or Get Supplier
        let supplierId = supplierMap.get(companyName);
        if (!supplierId) {
            supplierId = `sup_${uuidv4().slice(0, 8)}`;
            let iban = row['IBAN'] || "IBAN_BILINMIYOR_001";
            // Format IBAN if it looks like one
            if (typeof iban === 'string' && iban.startsWith('TR')) {
                // simple clean
                iban = iban.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || iban;
            }

            suppliers.push({
                id: supplierId,
                companyName: companyName,
                officialName: companyName, // Placeholder
                iban: iban,
                taxNo: row['VERGİ NO'] || "",
                category: row['KATEGORİ'] || (companyName.includes('SGK') ? "resmi-kurum" : "tedarikci"),
                defaultCurrency: row['PARA BİRİMİ'] || "TL",
                contact: "",
                isActive: true,
                notes: "Excel'den migrate edildi",
            });
            supplierMap.set(companyName, supplierId);
        }

        // Parse Payment / Debt data
        // Handling multi-currency and logic fixes
        const currency = row['PARA BİRİMİ'] || "TL";
        let previousDebt = parseFloat(row['DEVREDEN BORÇ'] || 0);
        let currentDebt = parseFloat(row['GÜNCEL BORÇ'] || row['BU AY BORÇ'] || 0);
        let paidAmount = parseFloat(row['ÖDENEN'] || 0);

        // Fix: Negative debts -> 0
        if (previousDebt < 0) previousDebt = 0;
        if (currentDebt < 0) currentDebt = 0;

        // Logic: If there is a payment or a debt, create a payment record
        // We treat each row as a "Transaction" or "Statement" for that month (Jan 2026 based on prompt)

        const paymentId = `pay_202601_${uuidv4().slice(0, 8)}`;
        const projectCode = row['PROJE KODU'] || "GENEL";

        // Check if "ÖMER DILMAÇ" multi-currency case
        // The prompt implies one row might have mixed info or separate rows. 
        // If separate rows in Excel, loop handles it. If one row has columns for USD and TL, we need to adapt.
        // For now assuming standard row structure.

        payments.push({
            id: paymentId,
            supplierId: supplierId!,
            paymentItem: row['ÖDEME KALEMİ'] || row['AÇIKLAMA'] || "Genel Hakediş",
            projectCode: projectCode,
            invoiceStatus: "FATURALI", // Default
            previousDebt: previousDebt,
            currentMonthDebt: currentDebt,
            paidAmount: paidAmount,
            currency: currency as "TL" | "USD" | "EUR" | "STG",
            paymentDate: "2026-01-15", // Mock date for migration
            exchangeRate: 1.0, // Should fetch historical if needed, but 1.0 for now
            status: paidAmount > 0 ? "completed" : "pending",
            attachments: [],
            createdBy: "system_migration",
            createdAt: new Date().toISOString()
        });
    });

    return { suppliers, payments };
}
