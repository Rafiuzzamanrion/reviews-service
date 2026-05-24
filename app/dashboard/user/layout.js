import AnimatedPage from "@/components/AnimatedPage";

export default function UserDashboardLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatedPage>{children}</AnimatedPage>
    </div>
  );
}
