import { render, screen } from "@testing-library/react";

import { AdminShell } from "./admin-shell";

describe("AdminShell", () => {
  it("shows the login form when there is no stored token", () => {
    render(
      <AdminShell
        initialAwards={[]}
        summary={{
          awards_count: 0,
          winners_count: 0,
          countries_count: 0,
          disciplines_count: 0,
          top_disciplines: [],
          read_only_mode: false,
        }}
      />,
    );

    expect(screen.getByText("تسجيل الدخول")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "دخول" })).toBeInTheDocument();
  });
});
