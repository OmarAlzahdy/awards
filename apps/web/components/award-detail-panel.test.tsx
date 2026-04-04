import { render, screen } from "@testing-library/react";

import { AwardDetailPanel } from "./award-detail-panel";

describe("AwardDetailPanel", () => {
  it("renders award information and winner preview", () => {
    render(
      <AwardDetailPanel
        award={{
          id: 3,
          name: "جائزة تفصيلية",
          summary: "وصف",
          supervising_body: "جهة",
          prize_value: "5000",
          year_established: 2024,
          country: "قطر",
          discipline: "علوم اجتماعية",
          notes: "ملاحظة",
          website_url: "https://example.com",
          authority_name: "هيئة",
          authority_type: "مؤسسة",
          winner_count: 2,
          created_at: "",
          updated_at: "",
        }}
        winners={[
          {
            id: 1,
            award_id: 3,
            cycle_label: "2025",
            winner_name: "اسم فائز",
            nationality_or_location: "مصر",
            summary: "نبذة فائز",
            discipline: "علوم اجتماعية",
            created_at: "",
            updated_at: "",
          },
        ]}
      />,
    );

    expect(screen.getByText("جائزة تفصيلية")).toBeInTheDocument();
    expect(screen.getByText("اسم فائز")).toBeInTheDocument();
    expect(screen.getByText("قطر")).toBeInTheDocument();
  });
});

