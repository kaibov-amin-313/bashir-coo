"use client";

import { useState } from "react";
import type { Category } from "@/types";
import { subcategoriesFor } from "@/data/subcategories";
import Link from "next/link";
import type { PieceRecord } from "@/lib/db/pieces";
import styles from "./admin.module.css";

/**
 * Bashir&Co — the piece form, shared by "add" and "edit".
 *
 * Bilingual by construction: RU and EN titles/prices/descriptions sit
 * side by side, because the whole site is bilingual and a piece with
 * only one language filled in would render blank on the other locale.
 *
 * The photo field shows the current image and previews a newly chosen
 * one before saving, so the client can see they've picked the right file
 * rather than discovering it after publishing.
 */

const GENDERS = [
  { value: "men", label: "Мужское" },
  { value: "women", label: "Женское" },
  { value: "unisex", label: "Унисекс" },
];

const CATEGORIES = [
  { value: "watches", label: "Часы" },
  { value: "fashion", label: "Одежда" },
  { value: "footwear", label: "Обувь" },
  { value: "bags", label: "Сумки" },
  { value: "jewelry", label: "Украшения" },
  { value: "accessories", label: "Аксессуары" },
  { value: "perfume", label: "Духи" },
];

/** Fallback art shown when a photo is missing — matches the site's slots. */
const VARIANTS = [
  { value: "watchSurface", label: "Часы" },
  { value: "macroFabric", label: "Ткань" },
  { value: "macroLeather", label: "Кожа" },
  { value: "jewelryLight", label: "Украшение" },
  { value: "macroTexture", label: "Фактура" },
  { value: "productStill", label: "Предмет" },
];

interface Props {
  piece?: PieceRecord;
  action: (formData: FormData) => void;
  submitLabel: string;
}

export function PieceForm({ piece, action, submitLabel }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  // The subcategory list depends on the chosen category — picking
  // "Одежда" must not offer "Кроссовки". Held in state so the select
  // repopulates the moment the category changes.
  const [category, setCategory] = useState<Category>(
    (piece?.category as Category) ?? "watches"
  );
  const subs = subcategoriesFor(category);

  return (
    <form action={action} className={styles.form}>
      {piece ? <input type="hidden" name="id" value={piece.id} /> : null}

      {/* Photo */}
      <div className={styles.field}>
        <span className={styles.label}>Фото</span>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview ?? piece?.image ?? ""}
            alt=""
            className={styles.preview}
            style={{ display: preview || piece?.image ? "block" : "none" }}
          />
          <div style={{ display: "grid", gap: 6, flex: 1 }}>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              className={styles.input}
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
            />
            <span className={styles.hint}>
              JPG или PNG, до 8 МБ. Если не выбрать — останется текущее фото.
            </span>
            <input
              type="hidden"
              name="image"
              defaultValue={piece?.image ?? ""}
            />
          </div>
        </div>
      </div>

      {/* Titles */}
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="titleRu">
            Название (RU) *
          </label>
          <input
            id="titleRu"
            name="titleRu"
            required
            defaultValue={piece?.titleRu ?? ""}
            className={styles.input}
            placeholder="Hermès, сумка Birkin 30"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="titleEn">
            Название (EN) *
          </label>
          <input
            id="titleEn"
            name="titleEn"
            required
            defaultValue={piece?.titleEn ?? ""}
            className={styles.input}
            placeholder="Hermès Birkin 30"
          />
        </div>
      </div>

      {/* Brand + gender */}
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="brand">Бренд</label>
          <input
            id="brand"
            name="brand"
            defaultValue={piece?.brand ?? ""}
            className={styles.input}
            placeholder="Hermès"
          />
          <span className={styles.hint}>По нему работает фильтр в каталоге</span>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="gender">Кому</label>
          <select
            id="gender"
            name="gender"
            defaultValue={piece?.gender ?? "unisex"}
            className={styles.select}
          >
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category + variant */}
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">Категория</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={styles.select}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="subcategory">
            Подкатегория
          </label>
          <select
            id="subcategory"
            name="subcategory"
            defaultValue={piece?.subcategory ?? ""}
            className={styles.select}
            disabled={subs.length === 0}
          >
            <option value="">— не указана —</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>{s.ru}</option>
            ))}
          </select>
          <span className={styles.hint}>Появится в фильтрах каталога</span>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="visualVariant">
            Заглушка, если нет фото
          </label>
          <select
            id="visualVariant"
            name="visualVariant"
            defaultValue={piece?.visualVariant ?? "productStill"}
            className={styles.select}
          >
            {VARIANTS.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price — the numeric one first: it's the figure that actually
          drives the cart total and, later, the payment step. The two
          text fields below it are only the wording shown when this is
          left empty. */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="priceUsd">Цена, $ (USD)</label>
        <input
          id="priceUsd"
          name="priceUsd"
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          defaultValue={piece?.priceUsd ?? ""}
          className={styles.input}
          placeholder="напр. 12500"
        />
        <span className={styles.hint}>
          Только число, в долларах. Оставьте пустым — вещь будет
          показываться как «Цена по запросу».
        </span>
      </div>

      {/* Prices */}
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="priceRu">Цена (RU)</label>
          <input
            id="priceRu"
            name="priceRu"
            defaultValue={piece?.priceRu ?? "Цена по запросу"}
            className={styles.input}
          />
          <span className={styles.hint}>
            Показывается, только если поле «Цена, $» пустое
          </span>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="priceEn">Цена (EN)</label>
          <input
            id="priceEn"
            name="priceEn"
            defaultValue={piece?.priceEn ?? "Price on request"}
            className={styles.input}
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="descriptionRu">
            Описание (RU)
          </label>
          <textarea
            id="descriptionRu"
            name="descriptionRu"
            defaultValue={piece?.descriptionRu ?? ""}
            className={styles.textarea}
            placeholder="Состояние, комплект, год — необязательно"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="descriptionEn">
            Описание (EN)
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            defaultValue={piece?.descriptionEn ?? ""}
            className={styles.textarea}
          />
        </div>
      </div>

      {/* Slug + order + published */}
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">
            Адрес (slug)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={piece?.slug ?? ""}
            className={styles.input}
            placeholder="оставьте пустым — создастся из названия"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sortOrder">
            Порядок
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={piece?.sortOrder ?? 0}
            className={styles.input}
          />
          <span className={styles.hint}>Меньше число — выше в списке</span>
        </div>
      </div>

      <div className={styles.checkRow}>
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={piece?.published ?? true}
        />
        <label className={styles.label} htmlFor="published">
          Показывать на сайте
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          {submitLabel}
        </button>
        <Link href="/admin" className={styles.btn}>
          Отмена
        </Link>
      </div>
    </form>
  );
}
