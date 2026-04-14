"use client";

import { useDeferredValue, useState } from "react";

import type { Award } from "@/lib/types";
import { LandingSearch } from "./landing-search";

type AwardsBrowserProps = {
  awards: Award[];
};

export function AwardsBrowser({ awards }: AwardsBrowserProps) {
  const [country, setCountry] = useState("");
  const [discipline, setDiscipline] = useState("");
  const deferredCountry = useDeferredValue(country);
  const deferredDiscipline = useDeferredValue(discipline);

  const filteredAwards = awards.filter((award) => {
    const countryMatch = deferredCountry
      ? (award.country || "").includes(deferredCountry)
      : true;
    const disciplineMatch = deferredDiscipline
      ? (award.discipline || "").includes(deferredDiscipline)
      : true;

    return countryMatch && disciplineMatch;
  });

  return (
    <div className="grid gap-8 px-4">
      <LandingSearch
        awards={filteredAwards}
        title="كل الجوائز"
        description="تصفح القائمة الكاملة للجوائز، ثم انتقل إلى صفحة الفائزين أو صفحة التفاصيل الخاصة بكل جائزة."
      />
    </div>
  );
}
