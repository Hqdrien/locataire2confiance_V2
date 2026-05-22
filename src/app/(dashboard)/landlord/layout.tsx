import { LandlordSidebar } from "@/components/dashboard/landlord-sidebar";

export default function LandlordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <LandlordSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6 md:p-8 max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
