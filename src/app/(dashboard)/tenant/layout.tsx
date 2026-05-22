import { TenantSidebar } from "@/components/dashboard/tenant-sidebar";

export default function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <TenantSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6 md:p-8 max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
