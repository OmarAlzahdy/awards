"use client";

import { useEffect, useState } from "react";

import {
  deleteAward,
  deleteWinner,
  fetchAwardWinners,
  fetchAwards,
  importWorkbook,
  loginAdmin,
  saveAward,
  saveWinner,
} from "@/lib/api";
import type { Award, ImportSummary, StatsSummary, Winner } from "@/lib/types";

const STORAGE_KEY = "awards-admin-token";

const emptyAwardForm = {
  id: "",
  name: "",
  summary: "",
  supervising_body: "",
  prize_value: "",
  year_established: "",
  country: "",
  discipline: "",
  notes: "",
  website_url: "",
  authority_name: "",
  authority_type: "",
};

const emptyWinnerForm = {
  cycle_label: "",
  winner_name: "",
  nationality_or_location: "",
  summary: "",
  discipline: "",
};

type AdminShellProps = {
  initialAwards: Award[];
  summary: StatsSummary;
};

export function AdminShell({ initialAwards, summary }: AdminShellProps) {
  const [token, setToken] = useState("");
  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
    error: "",
    loading: false,
  });
  const [awards, setAwards] = useState(initialAwards);
  const [selectedAwardId, setSelectedAwardId] = useState<number | "new">(
    initialAwards[0]?.id ?? "new",
  );
  const [awardForm, setAwardForm] =
    useState<Record<string, string>>(emptyAwardForm);
  const [winnerForm, setWinnerForm] =
    useState<Record<string, string>>(emptyWinnerForm);
  const [editingWinnerId, setEditingWinnerId] = useState<number | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [status, setStatus] = useState("");
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectedAward =
    awards.find((award) => award.id === selectedAwardId) || null;

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!selectedAward) {
      setAwardForm(emptyAwardForm);
      setWinners([]);
      return;
    }

    setAwardForm({
      id: String(selectedAward.id),
      name: selectedAward.name,
      summary: selectedAward.summary || "",
      supervising_body: selectedAward.supervising_body || "",
      prize_value: selectedAward.prize_value || "",
      year_established: selectedAward.year_established
        ? String(selectedAward.year_established)
        : "",
      country: selectedAward.country || "",
      discipline: selectedAward.discipline || "",
      notes: selectedAward.notes || "",
      website_url: selectedAward.website_url || "",
      authority_name: selectedAward.authority_name || "",
      authority_type: selectedAward.authority_type || "",
    });

    fetchAwardWinners(selectedAward.id).then(setWinners);
  }, [selectedAward]);

  async function refreshAwards() {
    const response = await fetchAwards({ pageSize: 100 });
    setAwards(response.items);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const response = await loginAdmin(
        loginState.username,
        loginState.password,
      );
      window.localStorage.setItem(STORAGE_KEY, response.token);
      setToken(response.token);
      setStatus("تم تسجيل الدخول بنجاح.");
    } catch (error) {
      setLoginState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : "تعذر تسجيل الدخول",
      }));
    } finally {
      setLoginState((current) => ({ ...current, loading: false }));
    }
  }

  async function handleAwardSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || summary.read_only_mode) {
      return;
    }

    const payload = {
      id: awardForm.id ? Number(awardForm.id) : undefined,
      name: awardForm.name,
      summary: awardForm.summary || null,
      supervising_body: awardForm.supervising_body || null,
      prize_value: awardForm.prize_value || null,
      year_established: awardForm.year_established
        ? Number(awardForm.year_established)
        : null,
      country: awardForm.country || null,
      discipline: awardForm.discipline || null,
      notes: awardForm.notes || null,
      website_url: awardForm.website_url || null,
      authority_name: awardForm.authority_name || null,
      authority_type: awardForm.authority_type || null,
    };

    const saved = await saveAward(
      token,
      payload,
      selectedAwardId === "new" ? undefined : selectedAwardId,
    );
    await refreshAwards();
    setSelectedAwardId(saved.id);
    setStatus("تم حفظ بيانات الجائزة.");
  }

  async function handleAwardDelete() {
    if (!token || summary.read_only_mode || selectedAwardId === "new") {
      return;
    }
    await deleteAward(token, selectedAwardId);
    await refreshAwards();
    setSelectedAwardId("new");
    setStatus("تم حذف الجائزة.");
  }

  async function handleWinnerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || summary.read_only_mode || !selectedAward) {
      return;
    }

    await saveWinner(
      token,
      {
        award_id: selectedAward.id,
        cycle_label: winnerForm.cycle_label || null,
        winner_name: winnerForm.winner_name,
        nationality_or_location: winnerForm.nationality_or_location || null,
        summary: winnerForm.summary || null,
        discipline: winnerForm.discipline || null,
      },
      editingWinnerId || undefined,
    );

    setWinnerForm(emptyWinnerForm);
    setEditingWinnerId(null);
    setWinners(await fetchAwardWinners(selectedAward.id));
    await refreshAwards();
    setStatus("تم حفظ بيانات الفائز.");
  }

  async function handleWinnerDelete(winnerId: number) {
    if (!token || summary.read_only_mode || !selectedAward) {
      return;
    }

    await deleteWinner(token, winnerId);
    setWinners(await fetchAwardWinners(selectedAward.id));
    await refreshAwards();
    setStatus("تم حذف الفائز.");
  }

  async function handleImport() {
    if (!token || summary.read_only_mode || !selectedFile) {
      return;
    }
    const response = await importWorkbook(token, selectedFile);
    setImportSummary(response);
    await refreshAwards();
    setStatus("تمت إعادة استيراد الملف بنجاح.");
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-26 border border-border bg-surface p-8 shadow-card backdrop-blur-2xl grid gap-5.5 grid-cols-1 overflow-hidden">
        <div className="grid gap-3 rounded-26 bg-white-55 p-6">
          <span className="text-brand font-display inline-block text-sm tracking-widest">
            لوحة الإدارة
          </span>
          <h1 className="text-clamp font-display font-bold mt-2">
            إدارة بيانات الجوائز والفائزين.
          </h1>
          <p className="text-muted text-base leading-loose">
            {summary.read_only_mode
              ? "هذه النسخة تعمل في وضع القراءة فقط على Vercel. يمكن تسجيل الدخول ومراجعة البيانات، لكن عمليات الكتابة معطلة."
              : "يمكنك هنا إدارة الجوائز، تعديل بياناتها، إضافة الفائزين، أو إعادة الاستيراد من ملف Excel."}
          </p>
        </div>
      </section>

      {!token ? (
        <section className="mx-auto max-w-lg rounded-26 border border-border bg-surface p-6 shadow-card backdrop-blur-2xl">
          <h2 className="text-clamp font-display font-bold mt-2">
            تسجيل الدخول
          </h2>
          <form className="grid gap-3.5 mt-4.5" onSubmit={handleLogin}>
            <label className="grid gap-2 text-muted">
              <span>اسم المستخدم</span>
              <input
                className="w-full min-h-52 rounded-18 border border-input-border bg-white-92 px-4 outline-none transition-colors focus:border-brand-40"
                value={loginState.username}
                onChange={(event) =>
                  setLoginState((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
              />
            </label>
            <label className="grid gap-2 text-muted">
              <span>كلمة المرور</span>
              <input
                type="password"
                className="w-full min-h-52 rounded-18 border border-input-border bg-white-92 px-4 outline-none transition-colors focus:border-brand-40"
                value={loginState.password}
                onChange={(event) =>
                  setLoginState((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
            </label>
            <button
              className="button-primary"
              disabled={loginState.loading}
              type="submit"
            >
              {loginState.loading ? "جارٍ التحقق..." : "دخول"}
            </button>
            {loginState.error ? (
              <p className="rounded-18 px-4 py-3.5 bg-brand-12 text-brand-strong">
                {loginState.error}
              </p>
            ) : null}
          </form>
        </section>
      ) : (
        <>
          <section className="flex items-center justify-between gap-2.5 rounded-26 border border-border bg-surface p-6 shadow-card backdrop-blur-2xl flex-wrap md:flex-nowrap">
            <label className="grid gap-2 text-muted flex-1 min-w-80">
              <span>اختر جائزة</span>
              <select
                className="w-full min-h-52 rounded-18 border border-input-border bg-white-92 px-4 outline-none transition-colors focus:border-brand-40"
                value={selectedAwardId}
                onChange={(event) =>
                  setSelectedAwardId(
                    event.target.value === "new"
                      ? "new"
                      : Number(event.target.value),
                  )
                }
              >
                <option value="new">جائزة جديدة</option>
                {awards.map((award) => (
                  <option key={award.id} value={award.id}>
                    {award.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="button-secondary mt-6 md:mt-0"
              type="button"
              onClick={() => {
                window.localStorage.removeItem(STORAGE_KEY);
                setToken("");
              }}
            >
              تسجيل الخروج
            </button>
          </section>

          <div className="grid gap-4.5 grid-cols-1 md:grid-cols-[1.1fr_1fr]">
            <article className="rounded-26 border border-border bg-surface p-6 shadow-card backdrop-blur-2xl">
              <h2 className="text-clamp font-display font-bold mt-2">
                بيانات الجائزة
              </h2>
              <form
                className="grid gap-3.5 mt-4.5"
                onSubmit={handleAwardSubmit}
              >
                {Object.entries(awardForm).map(([field, value]) => (
                  <label key={field} className="grid gap-2 text-muted">
                    <span>{field}</span>
                    <input
                      className="w-full min-h-52 rounded-18 border border-input-border bg-white-92 px-4 outline-none transition-colors focus:border-brand-40 disabled:opacity-50"
                      value={value}
                      onChange={(event) =>
                        setAwardForm((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      disabled={
                        summary.read_only_mode ||
                        (field === "id" && selectedAwardId !== "new")
                      }
                    />
                  </label>
                ))}
                <div className="flex items-center gap-2.5 flex-wrap justify-between mt-2">
                  <button
                    className="button-primary"
                    disabled={summary.read_only_mode}
                    type="submit"
                  >
                    حفظ الجائزة
                  </button>
                  <button
                    className="button-secondary"
                    disabled={
                      summary.read_only_mode || selectedAwardId === "new"
                    }
                    onClick={handleAwardDelete}
                    type="button"
                  >
                    حذف الجائزة
                  </button>
                </div>
              </form>
            </article>

            <article className="rounded-26 border border-border bg-surface p-6 shadow-card backdrop-blur-2xl">
              <h2 className="text-clamp font-display font-bold mt-2">
                الفائزون
              </h2>
              {selectedAward ? (
                <>
                  <form
                    className="grid gap-3.5 mt-4.5"
                    onSubmit={handleWinnerSubmit}
                  >
                    {Object.entries(winnerForm).map(([field, value]) => (
                      <label key={field} className="grid gap-2 text-muted">
                        <span>{field}</span>
                        <input
                          className="w-full min-h-52 rounded-18 border border-input-border bg-white-92 px-4 outline-none transition-colors focus:border-brand-40 disabled:opacity-50"
                          value={value}
                          onChange={(event) =>
                            setWinnerForm((current) => ({
                              ...current,
                              [field]: event.target.value,
                            }))
                          }
                          disabled={summary.read_only_mode}
                        />
                      </label>
                    ))}
                    <button
                      className="button-primary mt-2"
                      disabled={summary.read_only_mode}
                      type="submit"
                    >
                      {editingWinnerId ? "تحديث الفائز" : "إضافة فائز"}
                    </button>
                  </form>

                  <div className="grid gap-4.5 mt-4">
                    {winners.map((winner) => (
                      <article
                        className="rounded-22 border border-border bg-white-72 p-4.5 grid gap-3.5"
                        key={winner.id}
                      >
                        <h3 className="font-display font-semibold">
                          {winner.winner_name}
                        </h3>
                        <p className="text-muted text-base leading-loose">
                          {winner.summary || "لا توجد نبذة إضافية."}
                        </p>
                        <div className="flex items-center gap-2.5 flex-wrap justify-between">
                          <button
                            className="button-secondary"
                            onClick={() => {
                              setEditingWinnerId(winner.id);
                              setWinnerForm({
                                cycle_label: winner.cycle_label || "",
                                winner_name: winner.winner_name,
                                nationality_or_location:
                                  winner.nationality_or_location || "",
                                summary: winner.summary || "",
                                discipline: winner.discipline || "",
                              });
                            }}
                            type="button"
                          >
                            تعديل
                          </button>
                          <button
                            className="button-secondary"
                            disabled={summary.read_only_mode}
                            onClick={() => handleWinnerDelete(winner.id)}
                            type="button"
                          >
                            حذف
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted text-base leading-loose mt-4">
                  اختر جائزة أولًا لإدارة الفائزين.
                </p>
              )}
            </article>
          </div>

          <section className="rounded-26 border border-border bg-surface p-6 shadow-card backdrop-blur-2xl">
            <h2 className="text-clamp font-display font-bold mt-2">
              إعادة الاستيراد من Excel
            </h2>
            <div className="flex items-center gap-2.5 flex-wrap justify-between mt-4">
              <input
                className="w-full min-h-52 rounded-18 border border-input-border bg-white-92 px-4 py-2 outline-none transition-colors focus:border-brand-40"
                accept=".xlsx"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
                type="file"
              />
              <button
                className="button-primary"
                disabled={summary.read_only_mode || !selectedFile}
                onClick={handleImport}
                type="button"
              >
                تنفيذ الاستيراد
              </button>
            </div>
            {importSummary ? (
              <p className="rounded-18 px-4 py-3.5 bg-white-70 mt-4">
                تم استيراد {importSummary.awards_imported} جائزة و
                {importSummary.winners_imported} فائز مع تسجيل{" "}
                {importSummary.issues_recorded} ملاحظات.
              </p>
            ) : null}
          </section>
        </>
      )}

      {status ? (
        <p className="rounded-18 px-4 py-3.5 bg-white-70">{status}</p>
      ) : null}
    </div>
  );
}
