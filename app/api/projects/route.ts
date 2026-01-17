import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPayments } from "@/lib/data-service";

// Temporary static definition until we have a projects.json
const PROJECTS = [
    { code: "GZ", name: "Gaziemir Projesi", budget: 5000000 },
    { code: "CASINO", name: "Casino Otel Projesi", budget: 12000000 },
    { code: "ASKERİYE", name: "Askeriye Lojmanları", budget: 3000000 },
    { code: "CNN", name: "Çeşme Nazlı Nar Projesi", budget: 4500000 },
    { code: "MERIT", name: "Merit Residence", budget: 6800000 },
    { code: "BALO", name: "Balova Konutları", budget: 8200000 },
    { code: "KANER", name: "Kaner İnşaat Ortaklık", budget: 1500000 },
    { code: "ETKİNLİK MEYDANI", name: "Kongre Merkezi", budget: 25000000 },
    { code: "MUTFAK", name: "Mutfak Dolabı Tedarik", budget: 500000 },
    { code: "DOME TAKSİ", name: "Dome Taksi Durağı", budget: 750000 },
    { code: "İŞÇİ LOJMAN", name: "İnşaat Lojmanları", budget: 2000000 }
];

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // Determine stats for each project dynamically based on payments
        const payments = await getPayments();

        const projectStats = PROJECTS.map(project => {
            const projectPayments = payments.filter(p => p.projectCode === project.code);
            const totalSpent = projectPayments.reduce((sum, p) => sum + p.paidAmount, 0); // Simplified calc (currency ignored for now)

            return {
                ...project,
                totalSpent,
                remainingBudget: project.budget - totalSpent,
                progress: Math.min((totalSpent / project.budget) * 100, 100),
                status: totalSpent > project.budget * 0.9 ? "risk" : "active"
            };
        });

        return NextResponse.json({ data: projectStats });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
