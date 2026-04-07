import type {
  Award,
  AwardsResponse,
  ImportSummary,
  LoginResponse,
  StatsSummary,
  Winner,
} from "./types";

const FALLBACK_API_URL = "http://127.0.0.1:8000";

function resolveApiBaseUrl() {
  if (typeof window === "undefined") {
    return (
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      FALLBACK_API_URL
    );
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || FALLBACK_API_URL;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail =
      payload && typeof payload === "object" && "detail" in payload
        ? String(payload.detail)
        : response.statusText;
    throw new Error(detail || "request_failed");
  }

  return (await response.json()) as T;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = resolveApiBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  return parseJson<T>(response);
}

export async function fetchAwards(params?: {
  q?: string;
  discipline?: string;
  country?: string;
  page?: number;
  pageSize?: number;
}): Promise<AwardsResponse> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.discipline) search.set("discipline", params.discipline);
  if (params?.country) search.set("country", params.country);
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("page_size", String(params.pageSize));
  const query = search.toString();

  try {
    return await apiFetch<AwardsResponse>(
      `/v1/awards${query ? `?${query}` : ""}`,
    );
  } catch {
    return {
      items: [],
      page: 1,
      page_size: params?.pageSize ?? 12,
      total: 0,
      total_pages: 1,
    };
  }
}

export async function fetchAward(awardId: number): Promise<Award | null> {
  try {
    return await apiFetch<Award>(`/v1/awards/${awardId}`);
  } catch {
    return null;
  }
}

export async function fetchAwardWinners(awardId: number): Promise<Winner[]> {
  try {
    return await apiFetch<Winner[]>(`/v1/awards/${awardId}/winners`);
  } catch {
    return [];
  }
}

export async function fetchFeaturedWinnersByCountry(
  country: string,
  limit: number = 12,
): Promise<Array<Winner & { awardName: string; awardId: number }>> {
  try {
    // Fetch a larger set of ALL awards to find winners from the specified country
    const awards = await fetchAwards({ pageSize: 100 });
    const featuredWinners: Array<
      Winner & { awardName: string; awardId: number }
    > = [];

    // Fetch winners for each award and collect those from the target country
    for (const award of awards.items) {
      if (featuredWinners.length >= limit) break;
      const winners = await fetchAwardWinners(award.id);
      for (const winner of winners) {
        if (featuredWinners.length >= limit) break;
        // Check if winner's nationality/location matches the country search
        if (
          winner.nationality_or_location &&
          winner.nationality_or_location
            .toLowerCase()
            .includes(country.toLowerCase())
        ) {
          featuredWinners.push({
            ...winner,
            awardName: award.name,
            awardId: award.id,
          });
        }
      }
    }

    return featuredWinners;
  } catch {
    return [];
  }
}

export async function fetchSummary(): Promise<StatsSummary> {
  try {
    return await apiFetch<StatsSummary>("/v1/stats/summary");
  } catch {
    return {
      awards_count: 0,
      winners_count: 0,
      countries_count: 0,
      disciplines_count: 0,
      top_disciplines: [],
      read_only_mode: false,
    };
  }
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function saveAward(
  token: string,
  payload: Partial<Award> & { name: string },
  awardId?: number,
): Promise<Award> {
  return apiFetch<Award>(
    awardId ? `/v1/admin/awards/${awardId}` : "/v1/admin/awards",
    {
      method: awardId ? "PUT" : "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function deleteAward(
  token: string,
  awardId: number,
): Promise<void> {
  await apiFetch<{ ok: boolean }>(`/v1/admin/awards/${awardId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function saveWinner(
  token: string,
  payload: {
    award_id?: number;
    cycle_label?: string | null;
    winner_name: string;
    nationality_or_location?: string | null;
    summary?: string | null;
    discipline?: string | null;
  },
  winnerId?: number,
): Promise<Winner> {
  return apiFetch<Winner>(
    winnerId ? `/v1/admin/winners/${winnerId}` : "/v1/admin/winners",
    {
      method: winnerId ? "PUT" : "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function deleteWinner(
  token: string,
  winnerId: number,
): Promise<void> {
  await apiFetch<{ ok: boolean }>(`/v1/admin/winners/${winnerId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function importWorkbook(
  token: string,
  file: File,
): Promise<ImportSummary> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${resolveApiBaseUrl()}/v1/admin/import/excel`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return parseJson<ImportSummary>(response);
}
