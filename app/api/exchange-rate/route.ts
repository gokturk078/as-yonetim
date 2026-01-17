import { NextResponse } from "next/server";
import { getFileContent } from "@/lib/github-api";

export async function GET() {
    try {
        const { content } = await getFileContent("data/exchange-rates.json");
        if (!content) {
            // Mock data if file doesn't exist yet
            return NextResponse.json({
                date: new Date().toISOString().split("T")[0],
                rates: {
                    USD: { buy: 32.15, sell: 32.45 },
                    EUR: { buy: 35.89, sell: 36.12 },
                    STG: { buy: 40.23, sell: 40.67 }
                }
            });
        }
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }
}
