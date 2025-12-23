import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | El Paseo Auto Group",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-off-white overflow-x-hidden">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 pt-14 lg:pt-0 min-w-0">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
