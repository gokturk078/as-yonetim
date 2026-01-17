import { NextResponse } from "next/server";
import { getPayments, savePayment } from "@/lib/data-service";
import { getSession } from "@/lib/auth";
import { z } from "zod";

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const supplierId = searchParams.get("supplierId");
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "50");

        let payments = await getPayments();

        if (supplierId) {
            payments = payments.filter(p => p.supplierId === supplierId);
        }
        if (status) {
            payments = payments.filter(p => p.status === status);
        }

        // Sort by date desc
        payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

        return NextResponse.json({ data: payments.slice(0, limit) });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const paymentSchema = z.object({
    id: z.string().optional(),
    supplierId: z.string(),
    paymentItem: z.string().min(3),
    projectCode: z.string(),
    invoiceStatus: z.enum(["FATURALI", "FATURASIZ"]),
    previousDebt: z.number().min(0),
    currentMonthDebt: z.number().min(0),
    paidAmount: z.number().min(0),
    currency: z.enum(["TL", "USD", "EUR", "STG"]),
    paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    exchangeRate: z.number(),
    status: z.enum(["completed", "pending"]).optional(),
    attachments: z.array(z.string()).optional()
});

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const validatedData = paymentSchema.parse(body);

        const newPayment: any = {
            ...validatedData,
            id: validatedData.id || `pay_${new Date().toISOString().split("T")[0].replace(/-/g, "")}_${Math.random().toString(36).substr(2, 5)}`,
            status: validatedData.status || (validatedData.paidAmount > 0 ? "completed" : "pending"),
            attachments: validatedData.attachments || [],
            createdBy: (session as any).email || "unknown",
            createdAt: new Date().toISOString()
        };

        await savePayment(newPayment);

        // Provide feedback for UI
        return NextResponse.json({ success: true, payment: newPayment });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation Error", details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
