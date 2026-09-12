import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type SchoolStoryImage = {
  slug: string;
  alt: string;
  kind: "portrait" | "group" | "life";
};

const SCHOOL_STORY_ASSET_VERSION = "2026-09-12-1";

const schoolStoryImages: SchoolStoryImage[] = [
  { slug: "portrait-girl-glasses", alt: "Портрет выпускницы в светлом образе", kind: "portrait" },
  { slug: "portrait-boy-black", alt: "Современный портрет выпускника", kind: "portrait" },
  { slug: "portrait-boy-smile", alt: "Живой портрет выпускника", kind: "portrait" },
  { slug: "portrait-girl-stool", alt: "Портрет выпускницы в студии", kind: "portrait" },
  { slug: "friends-girls", alt: "Фотография выпускниц с подругами", kind: "group" },
  { slug: "friends-class", alt: "Выпускники фотографируются вместе", kind: "group" },
  { slug: "friends-boys", alt: "Дружеская фотография выпускников", kind: "group" },
  { slug: "class-dark-candid", alt: "Живая общая фотография выпускного класса", kind: "group" },
  { slug: "class-light", alt: "Общая фотография выпускного класса в светлых образах", kind: "group" },
  { slug: "friends-boys-black", alt: "Групповой портрет выпускников", kind: "group" },
  { slug: "school-corridor", alt: "Выпускной класс в школьном коридоре", kind: "life" },
  { slug: "school-gym", alt: "Выпускной класс в школьном спортивном зале", kind: "life" },
];

const SchoolStoryPicture = ({ image, className }: { image: SchoolStoryImage; className: string }) => (
  <picture>
    <source
      media="(max-width: 767px)"
      srcSet={`/school-stories/${image.slug}-mobile.webp?v=${SCHOOL_STORY_ASSET_VERSION}`}
    />
    <img
      src={`/school-stories/${image.slug}.webp?v=${SCHOOL_STORY_ASSET_VERSION}`}
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
  const [selectedGallery, setSelectedGallery] = useState<SchoolStoryImage[] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const portraits = schoolStoryImages.filter((image) => image.kind === "portrait");
  const groups = schoolStoryImages.filter((image) => image.kind === "group");
  const schoolLife = schoolStoryImages.filter((image) => image.kind === "life");

  useEffect(() => {
    if (!carouselApi) return;

    const updateSelectedImage = () => setSelectedImageIndex(carouselApi.selectedScrollSnap());
    updateSelectedImage();
    carouselApi.on("select", updateSelectedImage);

    return () => {
      carouselApi.off("select", updateSelectedImage);
    };
  }, [carouselApi]);

  const openGallery = (images: SchoolStoryImage[], image: SchoolStoryImage) => {
    setSelectedImageIndex(images.findIndex((item) => item.slug === image.slug));
    setSelectedGallery(images);
  };

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
            <SwipeRow images={portraits} onOpen={(image) => openGallery(portraits, image)} />
            <div className="hidden grid-cols-4 gap-4 md:grid">
              {portraits.map((image) => <PhotoButton key={image.slug} image={image} onOpen={() => openGallery(portraits, image)} />)}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">Класс и друзья</h3>
              <span className="text-sm text-muted-foreground md:hidden">Листайте →</span>
            </div>
            <SwipeRow images={groups} onOpen={(image) => openGallery(groups, image)} />
            <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3">
              {groups.map((image) => <PhotoButton key={image.slug} image={image} onOpen={() => openGallery(groups, image)} />)}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground md:text-3xl">Жизнь класса</h3>
                <p className="mt-2 text-muted-foreground">Знакомые школьные пространства становятся частью общей истории выпуска.</p>
              </div>
              <span className="shrink-0 text-sm text-muted-foreground md:hidden">Листайте →</span>
            </div>
            <SwipeRow images={schoolLife} onOpen={(image) => openGallery(schoolLife, image)} />
            <div className="hidden grid-cols-2 gap-4 md:grid">
              {schoolLife.map((image) => <PhotoButton key={image.slug} image={image} onOpen={() => openGallery(schoolLife, image)} />)}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selectedGallery)} onOpenChange={(open) => !open && setSelectedGallery(null)}>
        <DialogContent className="max-w-6xl border-0 bg-black/95 p-2 sm:p-4">
          <DialogHeader>
            <DialogTitle className="sr-only">Школьная фотография</DialogTitle>
            <DialogDescription className="sr-only">Галерея фотографий со школьной съёмки</DialogDescription>
          </DialogHeader>
          {selectedGallery && (
            <div className="relative">
              <Carousel
                key={selectedGallery[0]?.kind}
                setApi={setCarouselApi}
                opts={{ startIndex: selectedImageIndex, loop: true }}
                className="w-full"
              >
                <CarouselContent className="ml-0">
                  {selectedGallery.map((image) => (
                    <CarouselItem key={image.slug} className="pl-0">
                      <div className="flex min-h-[55vh] items-center justify-center px-1 pb-9 sm:px-12">
                        <SchoolStoryPicture image={image} className="max-h-[78vh] w-full rounded-lg object-contain" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 hidden h-12 w-12 border-white/30 bg-black/60 text-white hover:bg-black/80 hover:text-white md:inline-flex" />
                <CarouselNext className="right-3 hidden h-12 w-12 border-white/30 bg-black/60 text-white hover:bg-black/80 hover:text-white md:inline-flex" />
              </Carousel>

              <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                {selectedImageIndex + 1} из {selectedGallery.length}
                <span className="ml-2 md:hidden">· листайте</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SchoolStories;
