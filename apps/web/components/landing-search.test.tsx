import { fireEvent, render, screen } from "@testing-library/react";

import { LandingSearch } from "./landing-search";

const awards = [
  {
    id: 1,
    name: "جائزة نايف",
    summary: "نبذة",
    supervising_body: "جهة 1",
    prize_value: null,
    year_established: 2001,
    country: "السعودية",
    discipline: "دراسات دينية",
    notes: null,
    website_url: null,
    authority_name: "هيئة 1",
    authority_type: null,
    winner_count: 10,
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    name: "جائزة خليفة",
    summary: "نبذة",
    supervising_body: "جهة 2",
    prize_value: null,
    year_established: 2007,
    country: "الإمارات",
    discipline: "علوم تربوية",
    notes: null,
    website_url: null,
    authority_name: "هيئة 2",
    authority_type: null,
    winner_count: 12,
    created_at: "",
    updated_at: "",
  },
];

describe("LandingSearch", () => {
  it("filters awards by search text", () => {
    render(<LandingSearch awards={awards} description="desc" title="title" />);

    fireEvent.change(screen.getByLabelText("بحث الجوائز"), { target: { value: "الإمارات" } });

    expect(screen.getByText("جائزة خليفة")).toBeInTheDocument();
    expect(screen.queryByText("جائزة نايف")).not.toBeInTheDocument();
  });
});

