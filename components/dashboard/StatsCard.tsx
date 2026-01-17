import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    change?: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    description?: string;
}

export function StatsCard({ title, value, change, icon: Icon, trend = "up", description }: StatsCardProps) {
    return (
        <Card className="overflow-hidden relative group hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-slate-900 shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24 text-primary" />
            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {title}
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>

            <CardContent className="z-10 relative">
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</div>
                {(change || description) && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        {change && (
                            <span className={cn(
                                "font-medium px-1.5 py-0.5 rounded",
                                trend === "up" ? "text-green-600 bg-green-100 dark:bg-green-900/30" :
                                    trend === "down" ? "text-red-600 bg-red-100 dark:bg-red-900/30" : "text-slate-600"
                            )}>
                                {change}
                            </span>
                        )}
                        {description && <span className="opacity-80">{description}</span>}
                    </p>
                )}
            </CardContent>

            {/* Bottom gradient line */}
            <div className={cn(
                "absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r",
                trend === "up" ? "from-green-500/50 to-transparent" :
                    trend === "down" ? "from-red-500/50 to-transparent" :
                        "from-primary/50 to-transparent"
            )} />
        </Card>
    );
}
