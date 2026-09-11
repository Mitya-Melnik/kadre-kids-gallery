import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SchoolStoryImage = {
  slug: string;
  alt: string;
  kind: "portrait" | "group";
};

const schoolStoryImages: SchoolStoryImage[] = [
  { slug: "portrait-girl-glasses", alt: "Портрет выпускницы в светлом образе", kind: "portrait" },
  { slug: "portrait-boy-black", alt: "Современный портрет выпускника", kind: "portrait" },
  { slug: "portrait-girl-stool", alt: "Портрет выпускницы в студии", kind: "portrait" },
  { slug: "portrait-boy-smile", alt: "Живой портрет выпускника", kind: "portrait" },
  { slug: "friends-girls", alt: "Фотография выпускниц с подругами", kind: "group" },
  { slug: "friends-class", alt: "Выпускники фотографируются вместе", kind: "group" },
  { slug: "friends-boys", alt: "Дружеская фотография выпускников", kind: "group" },
  { slug: "class-dark-candid", alt: "Живая общая фотография выпускного класса", kind: "group" },
  { slug: "class-light", alt: "Общая фотография выпускного класса в светлых образах", kind: "group" },
  { slug: "friends-boys-black", alt: "Групповой портрет выпускников", kind: "group" },
];

const SchoolStoryPicture = ({ image, className }: { image: SchoolStoryImage; className: string }) => (
  <picture>
    <source media="(max-width: 767px)" srcSet={`/school-stories/${image.slug}-mobile.webp`} />
    <img
      src={`/school-stories/${image.slug}.webp`}
      alt={image.alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  </picture>
);

const PhotoButton = ({ image, onOpen }: { image: SchoolStoryImage; onOpen: () => void }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group block w-full overflow-hidden rounded-2xl bg-secondary/20 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    aria-label={`Увеличить фотографию: ${image.alt}`}
  >
    <SchoolStoryPicture
      image={image}
      className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] ${image.kind === "portrait" ? "aspect-[2/3]" : "aspect-[3/2]"}`}
    />
  </button>
);

const SwipeRow = ({ images, onOpen }: { images: SchoolStoryImage[]; onOpen: (image: SchoolStoryImage) => void }) => (
  <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
    {images.map((image) => (
      <div key={image.slug} className={`shrink-0 snap-center ${image.kind === "portrait" ? "w-[68vw]" : "w-[88vw]"}`}>
        <PhotoButton image={image} onOpen={() => onOpen(image)} />
      </div>
    ))}
  </div>
);

const SchoolStories = () => {
  const [selectedImage, setSelectedImage] = useState<SchoolStoryImage | null>(null);
  const portraits = schoolStoryImages.filter((image) => image.kind === "portrait");
  const groups = schoolStoryImages.filter((image) => image.kind === "group");

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Реальные съёмки</p>
          <h2 className="text-3xl font-bold md:text-5xl">Школьные истории</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Современные портреты и фотографии с друзьями, в которых выпускники остаются собой.
          </p>
        </header>

        <div className="mx-auto max-w-6xl">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">Портреты выпускников</h3>
              <span className="text-sm text-muted-foreground md:hidden">Листайте →</span>
            </div>
            <SwipeRow images={portraits} onOpen={setSelectedImage} />
            <div className="hidden grid-cols-4 gap-4 md:grid">
              {portraits.map((image) => <PhotoButton key={image.slug} image={image} onOpen={() => setSelectedImage(image)} />)}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">Класс и друзья</h3>
              <span className="text-sm text-muted-foreground md:hidden">Листайте →</span>
            </div>
            <SwipeRow images={groups} onOpen={setSelectedImage} />
            <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3">
              {groups.map((image) => <PhotoButton key={image.slug} image={image} onOpen={() => setSelectedImage(image)} />)}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selectedImage)} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-6xl border-0 bg-black/95 p-2 sm:p-4">
          <DialogHeader>
            <DialogTitle className="sr-only">Школьная фотография</DialogTitle>
            <DialogDescription className="sr-only">Увеличенный просмотр фотографии со школьной съёмки</DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <SchoolStoryPicture image={selectedImage} className="max-h-[82vh] w-full rounded-lg object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SchoolStories;
