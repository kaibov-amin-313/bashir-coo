import { Pool } from "pg";
import { unstable_cache } from "next/cache";
import type { Category } from "@/types";
import type { PlaceholderKind } from "@/components/media";
import type { Gender } from "@/data/curatedPieces";
import {
  curatedPieces as filePieces,
  type CuratedPiece,
} from "@/data/curatedPieces";

/**
 * Bashir&Co — piece storage (Neon Postgres, standard `pg` driver).
 *
 * Three decisions worth stating:
 *
 * 1. FALLBACK, NOT FAILURE. If the database is unreachable — env vars
 *    missing, Neon asleep and slow to wake, first deploy before the
 *    table exists — the site falls back to the twelve pieces in
 *    data/curatedPieces.ts rather than erroring or showing an empty
 *    catalogue. A luxury site that 500s because a database hiccuped is
 *    worse than one showing slightly stale stock.
 *
 * 2. CACHED READS. The public catalogue is wrapped in unstable_cache, so
 *    a thousand visitors don't become a thousand queries. This keeps us
 *    inside Neon's free tier and, just as importantly, means a visitor
 *    never waits on a cold start: they're served the cached result while
 *    the database sleeps. Writes bust the cache by tag, so an edit in
 *    the admin still shows up immediately.
 *
 * 3. ONE POOL, REUSED. Serverless functions spin up constantly; opening
 *    a fresh connection per invocation exhausts Postgres' connection
 *    limit. The pool is cached on globalThis so it survives hot reloads
 *    in dev and module re-evaluation in production.
 */

export const PIECES_CACHE_TAG = "pieces";

export interface PieceRecord {
  id: number;
  slug: string;
  category: Category;
  subcategory: string | null;
  brand: string;
  gender: Gender;
  titleRu: string;
  titleEn: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  priceRu: string;
  priceEn: string;
  /** Numeric price in USD; null means "quoted on request". */
  priceUsd: number | null;
  /** Maker's own designation, language-neutral (e.g. "RM 030"). */
  reference: string | null;
  sizeRu: string | null;
  sizeEn: string | null;
  conditionRu: string | null;
  conditionEn: string | null;
  completenessRu: string | null;
  completenessEn: string | null;
  image: string;
  visualVariant: PlaceholderKind;
  published: boolean;
  sortOrder: number;
}

/* ---------------------------- Connection ---------------------------- */

function connectionString(): string | undefined {
  // Neon's Vercel integration sets DATABASE_URL; POSTGRES_URL is kept as
  // a fallback so a manual/legacy setup keeps working.
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export function hasDatabase(): boolean {
  return Boolean(connectionString());
}

const globalForPool = globalThis as unknown as { pgPool?: Pool };

function getPool(): Pool {
  const url = connectionString();
  if (!url) throw new Error("DATABASE_URL не задан");

  if (!globalForPool.pgPool) {
    globalForPool.pgPool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false }, // Neon requires TLS
      max: 3, // serverless: keep the per-instance pool small
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return globalForPool.pgPool;
}

async function query<T = unknown>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

/* ------------------------------ Schema ------------------------------ */

export async function ensureSchema(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS pieces (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      brand TEXT NOT NULL DEFAULT '',
      gender TEXT NOT NULL DEFAULT 'unisex',
      title_ru TEXT NOT NULL,
      title_en TEXT NOT NULL,
      description_ru TEXT,
      description_en TEXT,
      price_ru TEXT NOT NULL DEFAULT 'Цена по запросу',
      price_en TEXT NOT NULL DEFAULT 'Price on request',
      -- The numeric price, in USD, and the single source of truth for
      -- anything that must add up (cart totals, and later the payment
      -- step). NULL means "quoted on request" — a real state for one-off
      -- commissions — and is deliberately not 0. price_ru/price_en stay
      -- as the display wording used when this is NULL.
      price_usd NUMERIC(12,2),
      -- Specifications shown on the piece page. All nullable: a piece can
      -- be listed before its details are confirmed, and an empty field
      -- renders as absent rather than as an empty row. The reference is
      -- language-neutral (a maker's own designation, e.g. RM 030); the
      -- rest are prose and so bilingual.
      reference TEXT,
      size_ru TEXT,
      size_en TEXT,
      condition_ru TEXT,
      condition_en TEXT,
      completeness_ru TEXT,
      completeness_en TEXT,
      image TEXT NOT NULL DEFAULT '',
      visual_variant TEXT NOT NULL DEFAULT 'productStill',
      published BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  // Additive migrations: a table created before these columns existed
  // gets them added rather than needing a manual rebuild.
  await query(`ALTER TABLE pieces ADD COLUMN IF NOT EXISTS subcategory TEXT;`);
  await query(`ALTER TABLE pieces ADD COLUMN IF NOT EXISTS brand TEXT NOT NULL DEFAULT '';`);
  await query(`ALTER TABLE pieces ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'unisex';`);
  await query(`ALTER TABLE pieces ADD COLUMN IF NOT EXISTS price_usd NUMERIC(12,2);`);
  for (const col of [
    "reference TEXT",
    "size_ru TEXT",
    "size_en TEXT",
    "condition_ru TEXT",
    "condition_en TEXT",
    "completeness_ru TEXT",
    "completeness_en TEXT",
  ]) {
    await query(`ALTER TABLE pieces ADD COLUMN IF NOT EXISTS ${col};`);
  }

  await query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

/* ----------------------------- Mapping ------------------------------ */

type PieceRow = Record<string, unknown>;

function rowToRecord(r: PieceRow): PieceRecord {
  return {
    id: Number(r.id),
    slug: String(r.slug),
    category: r.category as Category,
    subcategory: (r.subcategory as string | null) ?? null,
    brand: String(r.brand ?? ""),
    gender: (r.gender as Gender) ?? "unisex",
    titleRu: String(r.title_ru),
    titleEn: String(r.title_en),
    descriptionRu: (r.description_ru as string | null) ?? null,
    descriptionEn: (r.description_en as string | null) ?? null,
    priceRu: String(r.price_ru),
    priceEn: String(r.price_en),
    // pg returns NUMERIC as a string to preserve precision — coerce here
    // so consumers always see a number or null, never "1250.00".
    priceUsd: r.price_usd === null || r.price_usd === undefined
      ? null
      : Number(r.price_usd),
    reference: (r.reference as string) ?? null,
    sizeRu: (r.size_ru as string) ?? null,
    sizeEn: (r.size_en as string) ?? null,
    conditionRu: (r.condition_ru as string) ?? null,
    conditionEn: (r.condition_en as string) ?? null,
    completenessRu: (r.completeness_ru as string) ?? null,
    completenessEn: (r.completeness_en as string) ?? null,
    image: String(r.image ?? ""),
    visualVariant: r.visual_variant as PlaceholderKind,
    published: Boolean(r.published),
    sortOrder: Number(r.sort_order ?? 0),
  };
}

/** The file-based pieces, shaped as records — the fallback set. */
function fallbackRecords(): PieceRecord[] {
  return filePieces.map((p: CuratedPiece, i) => ({
    id: -(i + 1), // negative ids mark "not from the database"
    slug: p.slug,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    gender: p.gender,
    titleRu: p.title.ru,
    titleEn: p.title.en,
    descriptionRu: null,
    descriptionEn: null,
    priceRu: p.priceLabel.ru,
    priceEn: p.priceLabel.en,
    priceUsd: p.priceUsd,
    reference: null,
    sizeRu: null,
    sizeEn: null,
    conditionRu: null,
    conditionEn: null,
    completenessRu: null,
    completenessEn: null,
    image: p.image,
    visualVariant: p.visualVariant,
    published: true,
    sortOrder: i,
  }));
}

/* ------------------------ Public reads (cached) ---------------------- */

async function fetchPublishedPieces(): Promise<PieceRecord[]> {
  if (!hasDatabase()) return fallbackRecords();
  try {
    const rows = await query<PieceRow>(
      `SELECT * FROM pieces WHERE published = TRUE
       ORDER BY sort_order ASC, id ASC;`
    );
    if (rows.length === 0) return fallbackRecords();
    return rows.map(rowToRecord);
  } catch {
    return fallbackRecords();
  }
}

/**
 * All published pieces, for the public site — cached, so traffic doesn't
 * translate one-to-one into database queries, and a sleeping Neon
 * instance never makes a visitor wait.
 */
export const getPieces = unstable_cache(
  fetchPublishedPieces,
  ["published-pieces"],
  { tags: [PIECES_CACHE_TAG], revalidate: 300 }
);

/* ------------------- Admin reads & writes (uncached) ------------------ */

export async function getAllPieces(): Promise<PieceRecord[]> {
  await ensureSchema();
  const rows = await query<PieceRow>(
    `SELECT * FROM pieces ORDER BY sort_order ASC, id ASC;`
  );
  return rows.map(rowToRecord);
}

export async function getPieceById(id: number): Promise<PieceRecord | null> {
  await ensureSchema();
  const rows = await query<PieceRow>(
    `SELECT * FROM pieces WHERE id = $1 LIMIT 1;`,
    [id]
  );
  return rows[0] ? rowToRecord(rows[0]) : null;
}

export interface PieceInput {
  slug: string;
  category: Category;
  subcategory: string | null;
  brand: string;
  gender: Gender;
  titleRu: string;
  titleEn: string;
  descriptionRu?: string;
  descriptionEn?: string;
  priceRu: string;
  priceEn: string;
  priceUsd: number | null;
  /** Maker's own designation, language-neutral (e.g. "RM 030"). */
  reference: string | null;
  sizeRu: string | null;
  sizeEn: string | null;
  conditionRu: string | null;
  conditionEn: string | null;
  completenessRu: string | null;
  completenessEn: string | null;
  image: string;
  visualVariant: PlaceholderKind;
  published: boolean;
  sortOrder: number;
}

export async function createPiece(input: PieceInput): Promise<void> {
  await ensureSchema();
  await query(
    `INSERT INTO pieces (
       slug, category, subcategory, brand, gender, title_ru, title_en,
       description_ru, description_en, price_ru, price_en, price_usd,
       reference, size_ru, size_en, condition_ru, condition_en,
       completeness_ru, completeness_en,
       image, visual_variant, published, sort_order
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23);`,
    [
      input.slug, input.category, input.subcategory, input.brand, input.gender,
      input.titleRu, input.titleEn,
      input.descriptionRu ?? null, input.descriptionEn ?? null,
      input.priceRu, input.priceEn, input.priceUsd,
      input.reference, input.sizeRu, input.sizeEn,
      input.conditionRu, input.conditionEn,
      input.completenessRu, input.completenessEn,
      input.image, input.visualVariant,
      input.published, input.sortOrder,
    ]
  );
}

export async function updatePiece(id: number, input: PieceInput): Promise<void> {
  await ensureSchema();
  await query(
    `UPDATE pieces SET
       slug = $1, category = $2, subcategory = $3, brand = $4, gender = $5,
       title_ru = $6, title_en = $7,
       description_ru = $8, description_en = $9, price_ru = $10,
       price_en = $11, price_usd = $12,
       reference = $13, size_ru = $14, size_en = $15,
       condition_ru = $16, condition_en = $17,
       completeness_ru = $18, completeness_en = $19,
       image = $20, visual_variant = $21,
       published = $22, sort_order = $23
     WHERE id = $24;`,
    [
      input.slug, input.category, input.subcategory, input.brand, input.gender,
      input.titleRu, input.titleEn,
      input.descriptionRu ?? null, input.descriptionEn ?? null,
      input.priceRu, input.priceEn, input.priceUsd,
      input.reference, input.sizeRu, input.sizeEn,
      input.conditionRu, input.conditionEn,
      input.completenessRu, input.completenessEn,
      input.image, input.visualVariant,
      input.published, input.sortOrder, id,
    ]
  );
}

export async function deletePiece(id: number): Promise<void> {
  await ensureSchema();
  await query(`DELETE FROM pieces WHERE id = $1;`, [id]);
}

/**
 * Seeds the twelve file-based pieces into an empty table — so the client
 * opens the admin and finds their existing stock already there, rather
 * than a blank page they'd have to retype.
 */
export async function seedFromFile(): Promise<number> {
  await ensureSchema();
  const rows = await query<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM pieces;`
  );
  if (Number(rows[0]?.n ?? 0) > 0) return 0;

  for (const [i, p] of filePieces.entries()) {
    await createPiece({
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      brand: p.brand,
      gender: p.gender,
      titleRu: p.title.ru,
      titleEn: p.title.en,
      priceRu: p.priceLabel.ru,
      priceEn: p.priceLabel.en,
      priceUsd: p.priceUsd,
      reference: null,
      sizeRu: null,
      sizeEn: null,
      conditionRu: null,
      conditionEn: null,
      completenessRu: null,
      completenessEn: null,
      image: p.image,
      visualVariant: p.visualVariant,
      published: true,
      sortOrder: i,
    });
  }
  return filePieces.length;
}

/* ------------------------- Admin users (auth) ------------------------ */

export async function countAdminUsers(): Promise<number> {
  await ensureSchema();
  const rows = await query<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM admin_users;`
  );
  return Number(rows[0]?.n ?? 0);
}

export async function insertAdminUser(
  email: string,
  passwordHash: string
): Promise<void> {
  await query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2) ON CONFLICT (email) DO NOTHING;`,
    [email.toLowerCase(), passwordHash]
  );
}

export async function findAdminPasswordHash(
  email: string
): Promise<string | null> {
  await ensureSchema();
  const rows = await query<{ password_hash: string }>(
    `SELECT password_hash FROM admin_users WHERE email = $1 LIMIT 1;`,
    [email.toLowerCase()]
  );
  return rows[0]?.password_hash ?? null;
}
