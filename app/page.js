import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductGrid from "@/components/ProductGrid";
import AnimatedPage from "@/components/AnimatedPage";
import { RiFlashlightFill, RiShieldCheckFill, RiMailCheckFill } from "react-icons/ri";

export default async function HomePage() {
  await connectDB();

  const limit = 12;
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const total = await Product.countDocuments({ isActive: true });
  const totalPages = Math.ceil(total / limit);

  // Serialize Mongoose objects for client component
  const serialized = JSON.parse(JSON.stringify(products));

  return (
    <AnimatedPage>
      {/* Hero */}
      <section className="bg-mesh py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6">
            Premium <span className="gradient-text">Edu Accounts</span>
            <br />
            Instant Delivery
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            High-quality .edu email accounts with replacement warranty.
            Trusted by thousands of customers worldwide.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { icon: RiFlashlightFill, label: "Instant Delivery", color: "text-accent" },
              { icon: RiShieldCheckFill, label: "Replacement Warranty", color: "text-success" },
              { icon: RiMailCheckFill, label: ".edu Domain", color: "text-primary" },
            ].map((badge) => (
              <div key={badge.label} className="glass-card px-5 py-3 flex items-center gap-2">
                <badge.icon className={`text-xl ${badge.color}`} />
                <span className="text-sm font-semibold text-primary">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-16">
        <h2 className="text-2xl font-bold text-primary mb-8">Available Products</h2>
        <ProductGrid
          initialProducts={serialized}
          initialPage={1}
          totalPages={totalPages}
        />
      </section>
    </AnimatedPage>
  );
}
