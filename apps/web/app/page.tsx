import { fetchEgyptianFeaturedWinners, fetchSummary } from "@/lib/api";
import { HeroSection } from "@/components/hero-section";
import { StorySection } from "@/components/story-section";
import { StatisticsSection } from "@/components/statistics-section";
import { WhyPlatformSection } from "@/components/why-platform-section";
import { EgyptianWinnersSection } from "@/components/egyptian-winners-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [summary, egyptianWinners] = await Promise.all([
    fetchSummary(),
    fetchEgyptianFeaturedWinners(),
  ]);

  return (
    <div className="grid gap-6">
      <HeroSection />

      <EgyptianWinnersSection winners={egyptianWinners} />

      <StatisticsSection summary={summary} />

      <WhyPlatformSection />

      <StorySection />
    </div>
  );
}
