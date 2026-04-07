import { fetchAwards, fetchSummary } from "@/lib/api";
import { LandingSearch } from "@/components/landing-search";
import { HeroSection } from "@/components/hero-section";
import { StorySection } from "@/components/story-section";
import { StatisticsSection } from "@/components/statistics-section";
import { WhyPlatformSection } from "@/components/why-platform-section";
import { EgyptianWinnersSection } from "@/components/egyptian-winners-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [summary, awardsResponse] = await Promise.all([
    fetchSummary(),
    fetchAwards({ pageSize: 24 }),
  ]);

  return (
    <div className="grid gap-6">
      <HeroSection />

      <EgyptianWinnersSection />

      <StatisticsSection summary={summary} />

      <WhyPlatformSection />

      <StorySection />
    </div>
  );
}
