import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import ProductizedAssetsSection from "@/components/sections/ProductizedAssetsSection";

export default function ProductsPage() {
  return (
    <InnerPageShell>
      <InnerPageHero
        category="Productized Assets"
        title="Enterprise Products"
        highlightedWord="Products"
        visualType="enterprisePlatforms"
        description="Explore productized assets, reusable platform building blocks, and enterprise-ready accelerators for sovereign multi-agent systems."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "Product" }]}
      />
      <ProductizedAssetsSection />
    </InnerPageShell>
  );
}
