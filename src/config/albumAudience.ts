// Existing school naming and preview sources, shared by desktop and mobile.
export const schoolText = (text: string, audience: AlbumAudience) => {
  const adapted = text
    .replace(/Наша группа/g, "Наш класс")
    .replace(/одногруппниками/g, "одноклассниками")
    .replace(/воспитателей/g, "учителя")
    .replace(/воспитатели/g, "учитель")
    .replace(/группы/g, "класса")
    .replace(/группа/g, "класс")
    .replace(/детском саде/g, "школе")
    .replace(/Более 10 дизайнов/g, "6 дизайнов")
    .replace(/История детства/g, "Школьные годы");

  return audience === "school"
    ? adapted
      .replace(/ребёнка/g, "выпускника")
      .replace(/детьми/g, "выпускниками")
      .replace(/детей/g, "выпускников")
    : adapted;
};

export type AlbumAudience = "kindergarten" | "school" | "grade4";

export const seniorSchoolPreviewImages: Record<string, { basePath: string; design: string }> = {
  folder: { basePath: "/layouts-school/belyy/7", design: "Воздух" },
  trio: { basePath: "/layouts-school/antik/10", design: "Вне времени" },
  "six-pages": { basePath: "/layouts-school/portrety/1", design: "Характер" },
  "ten-pages": { basePath: "/layouts-school/modern/8", design: "Ритм" },
  "fourteen-pages": { basePath: "/layouts-school/modern/1", design: "Ритм" },
};

export const grade4PreviewImages: Record<string, { basePath: string; design: string }> = {
  folder: { basePath: "/layouts-grade4/calligraphy/9", design: "Каллиграфия" },
  trio: { basePath: "/layouts-grade4/colored-pencils/11", design: "Цветные карандаши" },
  "six-pages": { basePath: "/layouts-grade4/colored-pencils/1", design: "Цветные карандаши" },
  "ten-pages": { basePath: "/layouts-grade4/colored-pencils/4", design: "Цветные карандаши" },
  "fourteen-pages": { basePath: "/layouts-grade4/doodles/3", design: "Каракули" },
};

