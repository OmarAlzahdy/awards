import { notFound } from "next/navigation";

import { AwardDetailPanel } from "@/components/award-detail-panel";
import { fetchAward, fetchAwardWinners } from "@/lib/api";

type AwardDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AwardDetailPage({ params }: AwardDetailPageProps) {
  const { id } = await params;
  const awardId = Number(id);
  const [award, winners] = await Promise.all([fetchAward(awardId), fetchAwardWinners(awardId)]);

  if (!award) {
    notFound();
  }

  return <AwardDetailPanel award={award} winners={winners} />;
}

