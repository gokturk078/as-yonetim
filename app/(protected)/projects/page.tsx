"use client";

import { useProjects } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Briefcase, Calendar } from "lucide-react";

export default function ProjectsPage() {
    const { projects, isLoading } = useProjects();

    const getStatusColor = (status: string) => {
        return status === 'risk' ? 'bg-red-500' : 'bg-green-500';
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Projeler</h2>
                <p className="text-slate-500 text-sm">Proje bazlı bütçe ve harcama takibi</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project: any) => (
                    <Card key={project.code} className="hover:shadow-lg transition-shadow duration-200 dark:bg-slate-900 dark:border-slate-800">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                        {project.name}
                                    </CardTitle>
                                    <CardDescription>{project.code}</CardDescription>
                                </div>
                                <Badge variant={project.status === 'risk' ? "destructive" : "default"} className="uppercase text-xs">
                                    {project.status === 'risk' ? 'Limit Aşımı' : 'Devam Ediyor'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Tamamlanan</span>
                                        <span className="font-medium">{project.progress.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={project.progress} className={getStatusColor(project.status)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <div className="text-slate-500 text-xs mb-1">Toplam Bütçe</div>
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                            ₺{(project.budget / 1000000).toFixed(1)}M
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-xs mb-1">Harcanan</div>
                                        <div className="font-semibold text-primary">
                                            ₺{project.totalSpent.toLocaleString('tr-TR')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
