import { BadgePercent } from "lucide-react";

const PROMO_END_AT = new Date("2026-10-02T00:00:00+03:00").getTime();

const AlbumPromoStrip = () => {
  if (Date.now() >= PROMO_END_AT) return null;

  return (
    <section
      aria-label="Акция на выпускные альбомы"
      className="border-y border-primary-foreground/15 bg-gradient-primary py-4 text-primary-foreground"
    >
      <div className="container mx-auto flex items-center justify-center gap-3 px-4 text-center sm:gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 sm:h-12 sm:w-12">
          <BadgePercent className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </span>
        <div className="text-left sm:flex sm:items-baseline sm:gap-3">
          <p className="text-base font-bold leading-tight sm:text-xl">
            Скидка 10% при оплате до 1 октября
          </p>
          <p className="mt-1 text-sm leading-tight text-primary-foreground/85 sm:mt-0">
            на все выпускные альбомы
          </p>
        </div>
      </div>
    </section>
  );
};

export default AlbumPromoStrip;
