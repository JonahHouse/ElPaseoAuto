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
    <div className="min-h-screen bg-off-white pt-20">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
