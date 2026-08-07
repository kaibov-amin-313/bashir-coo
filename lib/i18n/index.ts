import type { Dictionary, Locale } from "./dictionary";
import { ru } from "./ru";
import { en } from "./en";

/**
 * Bashir&Co — i18n entry point.
 *
 * `/` is Russian (default), `/en/*` is English. No middleware, no
 * library: RU routes and their `/en` mirrors are thin files composing
 * the same view components with a `locale` prop — explicit, fully
 * static, and exactly as much machinery as two locales need.
 */

export type { Dictionary, Locale };

const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Prefixes a canonical (RU) path for the given locale. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "ru") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/**
 * Localized content for Pieces and Collections — titles, provenance,
 * names, atmosphere lines, keyed by slug. Kept beside the dictionaries
 * (it is translation data, not UI copy) and consumed only by
 * /lib/collections.ts's locale-aware resolvers, so components stay
 * unaware of where localized text comes from. The base records in
 * /data remain the CMS-shaped source of truth for structure.
 */

interface LocalizedPieceText {
  title: string;
  provenance: string;
}

export const pieceText: Record<string, Record<Locale, LocalizedPieceText>> = {
  "reference-1958": {
    en: {
      title: "Reference 1958",
      provenance:
        "Recognized during a private estate visit outside Geneva, wound daily by the same hand for four decades. The 35mm steel case has never been polished; the archive extract confirms a February 1958 delivery, and the caseback wear agrees with it.",
    },
    ru: {
      title: "Референс 1958",
      provenance:
        "Найдены при частном осмотре наследства под Женевой: сорок лет их заводила одна и та же рука, каждый день. Стальной корпус 35 мм ни разу не полировался; архивная выписка подтверждает поставку в феврале 1958 года — и износ задней крышки с ней согласен.",
    },
  },
  "the-meridian-stone": {
    en: {
      title: "The Meridian Stone",
      provenance:
        "A 4.2-carat unheated sapphire, cut in the 1930s and never recut since — the old proportions kept deliberately, against three separate suggestions to modernize them. Set in its original platinum mount, the milgrain worn soft where a glove passed over it for years.",
    },
    ru: {
      title: "Меридианный камень",
      provenance:
        "Негретый сапфир 4,2 карата, огранённый в 1930-е и с тех пор ни разу не переогранённый: старые пропорции сохранены сознательно, вопреки трём предложениям их «осовременить». В родной платиновой оправе; милгрин мягко стёрт там, где годами проходила перчатка.",
    },
  },
  "one-of-one": {
    en: {
      title: "One of One",
      provenance:
        "A workshop prototype that was never intended to leave the bench — the maker's pencil marks are still visible under the lacquer, and the house has chosen not to have them sealed. It resists category, which is precisely why it is here.",
    },
    ru: {
      title: "Единственный экземпляр",
      provenance:
        "Мастерской прототип, который не должен был покинуть верстак: под лаком до сих пор видны карандашные пометки мастера, и дом сознательно не стал их закреплять. Он не укладывается ни в одну категорию — именно поэтому он здесь.",
    },
  },
  "the-unlined-coat": {
    en: {
      title: "The Unlined Coat",
      provenance:
        "Cut from a single bolt of undyed double-face cashmere, finished entirely by hand because an unlined coat hides nothing. The maker produces eleven a year. This is the fourth of this year's eleven, and the only one in this weight.",
    },
    ru: {
      title: "Пальто без подкладки",
      provenance:
        "Скроено из одного отреза неокрашенного двустороннего кашемира и полностью отделано вручную: пальто без подкладки не прощает небрежности. Мастер делает одиннадцать таких в год. Это четвёртое из одиннадцати — и единственное в этом весе.",
    },
  },
  "the-brogue-in-shell": {
    en: {
      title: "The Brogue in Shell",
      provenance:
        "Shell cordovan from the last American tannery still finishing it the slow way — six months in the pits before a knife touches it. The brogueing is punched by hand, which is why no two perforations are perfectly alike.",
    },
    ru: {
      title: "Броги из кордована",
      provenance:
        "Кордован последней американской кожевни, которая всё ещё выделывает его медленно: полгода в чанах, прежде чем к коже прикоснётся нож. Перфорация пробита вручную — поэтому нет двух совершенно одинаковых отверстий.",
    },
  },
  "the-travel-fold": {
    en: {
      title: "The Travel Fold",
      provenance:
        "A bridle-leather document fold sized to one passport, one ticket, and nothing else — a discipline of smallness. The edges are burnished, not painted, and will darken where a thumb returns to them.",
    },
    ru: {
      title: "Дорожный фолд",
      provenance:
        "Фолд для документов из шорной кожи, рассчитанный ровно на паспорт и билет — и ни на что больше: дисциплина малого. Торцы полированы, а не крашены, и потемнеют там, куда будет возвращаться большой палец.",
    },
  },
  "the-diplomats-case": {
    en: {
      title: "The Diplomat's Case",
      provenance:
        "Commissioned in 1971 for a diplomat who specified two things: that it should open silently, and that it should never look new. The brass was chemically aged before assembly, and the lock still closes with the original quiet click it was ordered for.",
    },
    ru: {
      title: "Кейс дипломата",
      provenance:
        "Заказан в 1971 году дипломатом, поставившим два условия: кейс должен открываться бесшумно и никогда не выглядеть новым. Латунь состарили до сборки — и замок до сих пор закрывается тем самым тихим щелчком, ради которого всё делалось.",
    },
  },
  "the-observatory-chronometer": {
    en: {
      title: "The Observatory Chronometer",
      provenance:
        "Regulated for an observatory trial it never entered — the paperwork was filed, the movement was finished, and the entry was withdrawn for reasons the archive does not record. What remains is a movement finished beyond any commercial requirement, for an audience of no one.",
    },
    ru: {
      title: "Обсерваторный хронометр",
      provenance:
        "Отрегулирован для обсерваторного конкурса, в котором так и не участвовал: документы поданы, механизм закончен, заявка отозвана — причин архив не сохранил. Осталась отделка сверх любых коммерческих требований, сделанная в расчёте ни на чьи глаза.",
    },
  },
  "the-cartography-brooch": {
    en: {
      title: "The Cartography Brooch",
      provenance:
        "A mid-century gold brooch engraved with a coastline that does not quite match any modern map — the maker worked from a chart that was already fifty years out of date, and the house has left the discrepancy exactly as found.",
    },
    ru: {
      title: "Картографическая брошь",
      provenance:
        "Золотая брошь середины века с гравированной береговой линией, которая не совпадает ни с одной современной картой: мастер работал по лоции, устаревшей уже тогда на полвека. Дом оставил это расхождение ровно таким, каким его нашёл.",
    },
  },
};

interface LocalizedCollectionText {
  name: string;
  atmosphere: string;
}

export const collectionText: Record<
  string,
  Record<Locale, LocalizedCollectionText>
> = {
  "the-quiet-hour": {
    en: {
      name: "The Quiet Hour",
      atmosphere:
        "Objects made for precision no one asked them to prove — kept, wound, and worn past the point where proving mattered.",
    },
    ru: {
      name: "Тихий час",
      atmosphere:
        "Вещи, сделанные с точностью, которую никто не просил доказывать, — их хранили, заводили и носили дольше, чем это нужно было доказывать.",
    },
  },
  "the-long-coat-season": {
    en: {
      name: "The Long Coat Season",
      atmosphere:
        "Material that improves under weather and years — cut, stitched, and burnished by hands that expected it to outlast them.",
    },
    ru: {
      name: "Сезон длинных пальто",
      atmosphere:
        "Материал, который становится лучше от погоды и лет, — скроенный, сшитый и отполированный руками, рассчитывавшими, что вещь их переживёт.",
    },
  },
  "the-diplomats-room": {
    en: {
      name: "The Diplomat's Room",
      atmosphere:
        "Pieces commissioned to be discreet — made to close quietly, carry more than they show, and never look new.",
    },
    ru: {
      name: "Комната дипломата",
      atmosphere:
        "Вещи, заказанные ради сдержанности: закрываться тихо, вмещать больше, чем показывают, и никогда не выглядеть новыми.",
    },
  },
};

/**
 * The label for a category, never undefined.
 *
 * A piece can carry a category the dictionary doesn't know — a value
 * written before validation existed, or one retired from the union while
 * rows still referenced it (`rareCollectible` was removed exactly that
 * way). Callers dereference the result, so returning the raw key beats
 * returning undefined and taking the page down with it.
 */
export function categoryLabel(
  dictionary: Dictionary,
  category: string
): string {
  return (
    (dictionary.categoryLabels as Record<string, string>)[category] ?? category
  );
}

/**
 * Russian count agreement: 1 позиция / 2–4 позиции / 5+ позиций.
 *
 * The catalogue previously printed "позиций" for every count, so it read
 * "1 позиций". English was handled correctly in the same expression;
 * Russian — the primary language of the site — was not.
 *
 * The 11–14 exception is the reason a naive `n % 10` check isn't enough:
 * 11 takes the same form as 5, not the same as 1.
 */
export function plural(
  n: number,
  one: string,
  few: string,
  many: string
): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}
