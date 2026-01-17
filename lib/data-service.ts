import { getFileContent, updateFileContent } from "./github-api";
import { encryptData, decryptData } from "./crypto";
import { z } from "zod";

import { Payment, Supplier } from "./types";

// --- Constants ---
const SUPPLIERS_PATH = "data/suppliers.json";
const PAYMENTS_PATH = "data/payments.json";

// --- Helpers ---
const handleRead = async (path: string, encrypted: boolean) => {
    const { content, sha } = await getFileContent(path);
    if (!content) return { data: [], sha: null };
    const data = encrypted ? decryptData(content.data) : content;
    return { data: Array.isArray(data) ? data : [], sha };
};

const handleWrite = async (path: string, data: any[], sha: string | null, message: string, encrypted: boolean) => {
    const contentToSave = encrypted ? { data: encryptData(data) } : data;
    await updateFileContent(path, contentToSave, sha, message);
};

// --- Suppliers Service ---
export const getSuppliers = async (): Promise<Supplier[]> => {
    const { data } = await handleRead(SUPPLIERS_PATH, false);
    return data as Supplier[];
};

export const saveSupplier = async (supplier: Supplier) => {
    const { data, sha } = await handleRead(SUPPLIERS_PATH, false);
    const existingIndex = data.findIndex((s: Supplier) => s.id === supplier.id);

    let newData;
    if (existingIndex >= 0) {
        newData = [...data];
        newData[existingIndex] = supplier;
    } else {
        newData = [...data, supplier];
    }

    await handleWrite(SUPPLIERS_PATH, newData, sha, `Update supplier: ${supplier.companyName}`, false);
};

// --- Payments Service ---
export const getPayments = async (): Promise<Payment[]> => {
    const { data } = await handleRead(PAYMENTS_PATH, true);
    return data as Payment[];
};

export const savePayment = async (payment: Payment) => {
    const { data, sha } = await handleRead(PAYMENTS_PATH, true);
    const existingIndex = data.findIndex((p: Payment) => p.id === payment.id);

    let newData;
    if (existingIndex >= 0) {
        newData = [...data];
        newData[existingIndex] = payment;
    } else {
        newData = [...data, payment];
    }

    await handleWrite(PAYMENTS_PATH, newData, sha, `Save payment: ${payment.id}`, true);
};
