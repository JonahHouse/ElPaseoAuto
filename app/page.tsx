import Hero from "@/components/home/Hero";
import ServicesBar from "@/components/home/ServicesBar";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AboutPreview from "@/components/home/AboutPreview";
import ContactCTA from "@/components/home/ContactCTA";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getFeaturedVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      isSold: false,
      isFeatured: true,
      images: {
        some: {}, // Only show vehicles with at least one image
      },
    },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return vehicles.map((v) => ({
    id: v.id,
    vin: v.vin,
    year: v.year,
    make: v.make,
    model: v.model,
    trim: v.trim,
    price: v.price ? Number(v.price) : null,
    mileage: v.mileage,
    exteriorColor: v.exteriorColor,
    images: v.images.map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
    })),
  }));
}

export default async function HomePage() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <>
      <Hero vehicles={featuredVehicles} />
      <ServicesBar />
      <FeaturedVehicles vehicles={featuredVehicles} />
      <WhyChooseUs />
      <AboutPreview />
      <ContactCTA />
    </>
  );
}
