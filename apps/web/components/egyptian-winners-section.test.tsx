import { render, screen } from "@testing-library/react";

import { EgyptianWinnersSection } from "./egyptian-winners-section";

describe("EgyptianWinnersSection", () => {
  it("renders the supplied winners with their live fields", () => {
    render(
      <EgyptianWinnersSection
        winners={[
          {
            id: 21,
            award_id: 2,
            cycle_label: "2024 (الدورة 1)",
            winner_name: "أ.د. أيمن فؤاد سيد",
            nationality_or_location: "مصري",
            summary: "تحقيق المخطوطات والتراث العربي",
            discipline: null,
            award_name: "جائزة الدوحة للكتاب العربي",
            award_discipline: "تاريخ وتراث",
            created_at: "",
            updated_at: "",
          },
        ]}
      />,
    );

    expect(screen.getByText("أ.د. أيمن فؤاد سيد")).toBeInTheDocument();
    expect(screen.getByText("2024 (الدورة 1)")).toBeInTheDocument();
    expect(screen.getByText("تاريخ وتراث")).toBeInTheDocument();
    expect(screen.getByText("تحقيق المخطوطات والتراث العربي")).toBeInTheDocument();
  });

  it("renders nothing when there are no winners", () => {
    const { container } = render(<EgyptianWinnersSection winners={[]} />);

    expect(container.firstChild).toBeNull();
  });
});
