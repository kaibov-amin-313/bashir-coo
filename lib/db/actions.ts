"use server";

import { parseUsdInput } from "@/lib/price";
import { parseCategory } from "@/config/categories";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import type { Category } from "@/types";
import type { PlaceholderKind } from "@/components/media";
import type { Gender } from "@/data/curatedPieces";
import {
  createPiece,
  updatePiece,
  deletePiece,
  seedFromFile,
  PIECES_CACHE_TAG,
  type PieceInput,
} from "@/lib/db/pieces";
import {
  verifyCredentials,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/db/auth";

/**
 * Bashir&Co — admin server actions.
 *
 * Every mutating action re-checks the session itself. Guarding only the
 * page that renders the form would be a hole: actions are POST endpoints
 * in their own right and can be called directly, so authorisation has to
 * live next to the mutation, not next to the UI.
 *
 * After a write we revalidate the public routes, so a piece added in the
 * admin appears on the live site immediately rather than waiting for the
 * next deploy.
 */

const PUBLIC_PATHS = ["/", "/en", "/collection", "/en/collection"];

function revalidatePublic(): void {
  // Bust the cached piece list first — the pages below read through it,
  // so revalidating paths alone would just re-render stale data.
  // updateTag (not revalidateTag) because this runs inside a Server
  // Action: it gives read-your-own-writes, so the admin sees the change
  // immediately rather than on the next request.
  updateTag(PIECES_CACHE_TAG);
  for (const p of PUBLIC_PATHS) revalidatePath(p);
}

async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Не авторизован");
  }
}

function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };
  return input
    .toLowerCase()
    // Strip accents first, so "Hermès" becomes "hermes" rather than
    // "herm-s" — the non-ASCII character would otherwise be swept up by
    // the punctuation replace below and turned into a separator.
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function readForm(form: FormData): PieceInput {
  const titleRu = String(form.get("titleRu") ?? "").trim();
  const titleEn = String(form.get("titleEn") ?? "").trim();
  const slugRaw = String(form.get("slug") ?? "").trim();

  if (!titleRu) throw new Error("Название (RU) обязательно");
  if (!titleEn) throw new Error("Название (EN) обязательно");

  // slug is UNIQUE NOT NULL. A title in a script slugify can't transliterate
  // (or one that's only punctuation) reduces to "", which saves once and
  // then fails the second time with a raw Postgres uniqueness error in the
  // admin's face. Fall back to a timestamped stem instead — ugly, but
  // editable, and it never collides.
  const slug =
    slugify(slugRaw || titleEn) ||
    slugify(titleRu) ||
    `piece-${Date.now().toString(36)}`;

  return {
    slug,
    // Validated, not cast: `as Category` is erased at build time, so an
    // unrecognised value would reach the database and then crash every
    // page that looks the label up. Unknown input falls back to the
    // default rather than being written through.
    category: parseCategory(String(form.get("category") ?? "")) ?? "watches",
    subcategory: String(form.get("subcategory") ?? "").trim() || null,
    brand: String(form.get("brand") ?? "").trim(),
    gender: (["men", "women", "unisex"] as const).includes(
      String(form.get("gender") ?? "") as Gender
    )
      ? (String(form.get("gender")) as Gender)
      : "unisex",
    titleRu,
    titleEn,
    descriptionRu: String(form.get("descriptionRu") ?? "").trim() || undefined,
    descriptionEn: String(form.get("descriptionEn") ?? "").trim() || undefined,
    priceRu: String(form.get("priceRu") ?? "").trim() || "Цена по запросу",
    priceEn: String(form.get("priceEn") ?? "").trim() || "Price on request",
    // Empty field → null ("quoted on request"), never 0.
    priceUsd: parseUsdInput(String(form.get("priceUsd") ?? "")),
    image: String(form.get("image") ?? "").trim(),
    visualVariant: (String(
      form.get("visualVariant") ?? "productStill"
    ) as PlaceholderKind),
    published: form.get("published") === "on",
    sortOrder: Number(form.get("sortOrder") ?? 0) || 0,
  };
}

/** Uploads a photo to Vercel Blob and returns its public URL. */
async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Файл должен быть изображением");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Изображение больше 8 МБ — сожмите его");
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Хранилище фото не настроено (нет BLOB_READ_WRITE_TOKEN)"
    );
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const name = `pieces/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(name, file, {
    access: "public",
    contentType: file.type,
  });
  return blob.url;
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const ok = await verifyCredentials(email, password);
  if (!ok) {
    redirect("/admin/login?error=1");
  }
  await createSession(email);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function createPieceAction(formData: FormData): Promise<void> {
  await requireAuth();

  const input = readForm(formData);
  const uploaded = await uploadImage(formData.get("imageFile") as File | null);
  if (uploaded) input.image = uploaded;

  await createPiece(input);
  revalidatePublic();
  redirect("/admin");
}

export async function updatePieceAction(formData: FormData): Promise<void> {
  await requireAuth();

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) throw new Error("Неверный id");

  const input = readForm(formData);
  const uploaded = await uploadImage(formData.get("imageFile") as File | null);
  if (uploaded) input.image = uploaded;

  await updatePiece(id, input);
  revalidatePublic();
  redirect("/admin");
}

export async function deletePieceAction(formData: FormData): Promise<void> {
  await requireAuth();

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) throw new Error("Неверный id");

  await deletePiece(id);
  revalidatePublic();
  redirect("/admin");
}

/** Imports the twelve existing pieces into an empty database. */
export async function seedAction(): Promise<void> {
  await requireAuth();
  await seedFromFile();
  revalidatePublic();
  redirect("/admin");
}
