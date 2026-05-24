import AdminSidebar from "@/components/AdminSidebar";
import AnimatedPage from "@/components/AnimatedPage";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 lg:ml-[250px] p-4 sm:p-6 lg:p-8">
        <AnimatedPage>{children}</AnimatedPage>
      </div>
    </div>
  );
}
