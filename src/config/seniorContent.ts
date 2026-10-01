import { Building2, UserCheck, UsersRound } from "lucide-react";

export const schoolHeroImages = [
  { basePath: "/layouts-school/modern/1", alt: "Школьный альбом в дизайне «Ритм» — обложка" },
  { basePath: "/layouts-school/light/2", alt: "Школьный альбом в дизайне «Свобода» — обложка" },
  { basePath: "/layouts-school/modern/8", alt: "Школьный альбом в дизайне «Ритм» — разворот класса" },
  { basePath: "/layouts-school/modern/7", alt: "Школьный альбом в дизайне «Ритм» — разворот с выпускниками" },
] as const;

export const seniorParticipantBenefits = [
  {
    icon: UserCheck,
    title: "Выпускнику",
    text: "Современная съёмка без неловких поз. Свой портрет, имя и персональный разворот каждый выпускник подтверждает до печати.",
  },
  {
    icon: UsersRound,
    title: "Ответственному за класс",
    text: "Помогаем выбрать формат и пройти все этапы. Родители подтверждают персональные страницы, а замечания передаются нам одним общим списком.",
  },
  {
    icon: Building2,
    title: "Школе",
    text: "Заранее согласуем даты и график съёмок. Комплектацию, сроки и ответственность сторон фиксируем в договоре.",
  },
] as const;

