import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen mesh-bg">
      <Sidebar />
      <main className="pl-64">
        {children}
      </main>
    </div>
  );
}
