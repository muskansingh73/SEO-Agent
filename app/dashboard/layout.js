import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 lg:py-12">{children}</main>
    </div>
  );
}