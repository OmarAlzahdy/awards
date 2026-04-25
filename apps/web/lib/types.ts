export type Award = {
  id: number;
  name: string;
  summary: string | null;
  supervising_body: string | null;
  prize_value: string | null;
  year_established: number | null;
  country: string | null;
  discipline: string | null;
  notes: string | null;
  website_url: string | null;
  authority_name: string | null;
  authority_type: string | null;
  winner_count: number;
  created_at: string;
  updated_at: string;
};

export type Winner = {
  id: number;
  award_id: number;
  cycle_label: string | null;
  winner_name: string;
  nationality_or_location: string | null;
  summary: string | null;
  discipline: string | null;
  created_at: string;
  updated_at: string;
};

export type FeaturedWinner = Winner & {
  award_name: string;
  award_discipline: string | null;
};

export type AwardsResponse = {
  items: Award[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type StatsSummary = {
  awards_count: number;
  winners_count: number;
  countries_count: number;
  disciplines_count: number;
  top_disciplines: Array<{ name: string; count: number }>;
  read_only_mode: boolean;
};

export type LoginResponse = {
  token: string;
  read_only_mode: boolean;
  expires_in_seconds: number;
};

export type ImportSummary = {
  awards_imported: number;
  winners_imported: number;
  issues_recorded: number;
  ignored_blank_columns: number;
  report_path: string;
};

export type Dataset = {
  id: number;
  label: string;
  is_active: boolean;
  imported_at: string;
  awards_count: number;
  winners_count: number;
};
