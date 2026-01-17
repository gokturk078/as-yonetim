import { NextResponse } from "next/server";
import { getSuppliers, saveSupplier } from "@/lib/data-service";
import { getSession } from "@/lib/auth";
import { z } from "zod";

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.toLowerCase();

        let suppliers = await getSuppliers();

        if (search) {
            suppliers = suppliers.filter(s =>
                s.companyName.toLowerCase().includes(search) ||
                s.officialName.toLowerCase().includes(search) ||
                s.category.toLowerCase().includes(search)
            );
        }

        // Sort by name
        suppliers.sort((a, b) => a.companyName.localeCompare(b.companyName));

        return NextResponse.json({ data: suppliers });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const supplierSchema = z.object({
    id: z.string().optional(),
    companyName: z.string().min(2),
    officialName: z.string().optional(),
    iban: z.string().regex(/^TR\d{2}\s?(\d{4}\s?){5}\d{2}$/, "Invalid IBAN format").or(z.literal("IBAN_BILINMIYOR_001")),
    taxNo: z.string().max(11).optional(),
    category: z.string().optional(),
    defaultCurrency: z.enum(["TL", "USD", "EUR", "STG"]).default("TL"),
    contact: z.string().optional(),
    isActive: z.boolean().default(true),
    notes: z.string().optional(),
});

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const validatedData = supplierSchema.parse(body);

        const newSupplier = {
            ...validatedData,
            id: validatedData.id || `sup_${Math.random().toString(36).substr(2, 8)}`, // Simple ID gen
            officialName: validatedData.officialName || validatedData.companyName,
            taxNo: validatedData.taxNo || "",
            category: validatedData.category || "genel",
            contact: validatedData.contact || "",
            notes: validatedData.notes || "",
        };

        await saveSupplier(newSupplier);

        return NextResponse.json({ success: true, supplier: newSupplier });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation Error", details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
