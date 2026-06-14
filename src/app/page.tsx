import { Hero } from "@/components/sections/Hero";
import { QuickService } from "@/components/sections/QuickService";
import { CoreServices } from "@/components/sections/CoreServices";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { RentalShop } from "@/components/sections/RentalShop";
import { BlogFeed } from "@/components/sections/BlogFeed";
import { OfficialChannels } from "@/components/sections/OfficialChannels";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickService />
      <CoreServices />
      <CaseStudies />
      <RentalShop />
      <BlogFeed />
      <OfficialChannels />
      <CtaBanner />
    </>
  );
}
