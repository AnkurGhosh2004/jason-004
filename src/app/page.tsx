import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      <Hero />
      <HowItWorks />
    </div>
  );
}
