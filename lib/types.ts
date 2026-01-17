// Re-export types to be used in utils without circular dependency issues if any
// In this setup, we just define them here or import them. 
// Since utils imports from here, we keep it simple.

export interface Supplier {
    id: string;
    companyName: string;
    officialName: string;
    iban: string;
    taxNo: string;
    category: string;
    defaultCurrency: string;
    contact: string;
    isActive: boolean;
    notes: string;
}

export interface Payment {
    id: string;
    supplierId: string;
    paymentItem: string;
    projectCode: string;
    invoiceStatus: "FATURALI" | "FATURASIZ";
    previousDebt: number;
    currentMonthDebt: number;
    paidAmount: number;
    currency: "TL" | "USD" | "EUR" | "STG";
    paymentDate: string;
    exchangeRate: number;
    status: "completed" | "pending";
    attachments: string[];
    createdBy: string;
    createdAt: string;
}
