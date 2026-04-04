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
    const countryMatch = deferredCountry ? (award.country || "").includes(deferredCountry) : true;
    const disciplineMatch = deferredDiscipline
      ? (award.discipline || "").includes(deferredDiscipline)
      : true;

    return countryMatch && disciplineMatch;
  });

  return (
    <div className="page-stack">
      <section className="filters-bar">
        <label>
          <span>تصفية حسب الدولة</span>
          <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="مثال: الإمارات" />
        </label>
        <label>
          <span>تصفية حسب التخصص</span>
          <input
            value={discipline}
            onChange={(event) => setDiscipline(event.target.value)}
            placeholder="مثال: علوم تربوية"
          />
        </label>
      </section>

      <LandingSearch
        awards={filteredAwards}
        title="كل الجوائز"
        description="تصفح القائمة الكاملة للجوائز، ثم انتقل إلى صفحة الفائزين أو صفحة التفاصيل الخاصة بكل جائزة."
      />
    </div>
  );
}

