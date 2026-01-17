export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7 h-[400px]">
                <div className="col-span-4 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                <div className="col-span-3 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}
