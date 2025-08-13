import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Small helper that tries multiple sources and hides itself if none load
function LazySmartImage({
  srcs,
  alt,
  className,
  loading = "lazy",
}: {
  srcs: string[];
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [idx, setIdx] = useState(0);
  const [hidden, setHidden] = useState(false);

  if (hidden || srcs.length === 0) return null;

  return (
    <img
      src={srcs[idx]}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (idx < srcs.length - 1) {
          setIdx((i) => i + 1);
        } else {
          setHidden(true);
        }
      }}
    />
  );
}

const MAX_IMAGES_PER_ALBUM = 20; // You can change this if needed

const albums = [
  { slug: "suhocvety", title: "Сухоцветы" },
  { slug: "tykvennoe", title: "Тыквенное настроение" },
  { slug: "osenkach", title: "Осенние качели" },
  { slug: "osenskazka", title: "Осенняя сказка" },
  { slug: "zimaskazka", title: "Зимняя сказка" },
  { slug: "paravoz", title: "В объятиях зимы" },
  { slug: "olen", title: "Легенда севера" },
  { slug: "okno", title: "Зимний вечер" },
  { slug: "provance", title: "Прованс" },
  { slug: "italy", title: "Италия" },
  { slug: "biker", title: "Байкер" },
  { slug: "vderevne", title: "В деревне" },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Наши съемки
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Загрузите свои фото в папки в public — и галерея автоматически их подхватит.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {albums.map((album) => {
            const coverBase = `/galleries/${album.slug}/cover`;
            const coverCandidates = [
              `${coverBase}.webp`,
              `${coverBase}.jpg`,
              `${coverBase}.jpeg`,
              `${coverBase}.png`,
              `/placeholder.svg`, // final fallback
            ];

            return (
              <Dialog key={album.slug}>
                <DialogTrigger asChild>
                  <article className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300">
                      <LazySmartImage
                        srcs={coverCandidates}
                        alt={`${album.title} — обложка фотосессии`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-semibold drop-shadow">
                          {album.title}
                        </h3>
                      </div>
                    </div>
                  </article>
                </DialogTrigger>

                <DialogContent className="max-w-5xl md:max-w-6xl max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                      {album.title}
                    </h3>
                    <div className="columns-1 sm:columns-2 lg:columns-3">
                      {Array.from({ length: MAX_IMAGES_PER_ALBUM }, (_, i) => i + 1).map((n) => {
                        const base = `/galleries/${album.slug}/${n}`;
                        const candidates = [
                          `${base}.webp`,
                          `${base}.jpg`,
                          `${base}.jpeg`,
                          `${base}.png`,
                        ];
                        return (
                          <LazySmartImage
                            key={`${album.slug}-${n}`}
                            srcs={candidates}
                            alt={`${album.title} — фото ${n}`}
                            className="mb-4 w-full h-auto rounded-lg shadow-soft break-inside-avoid"
                            loading="lazy"
                          />
                        );
                      })}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
