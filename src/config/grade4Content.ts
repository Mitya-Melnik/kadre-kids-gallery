import { Building2, Smile, UserCheck, UsersRound } from "lucide-react";

export const grade4HeroImages = [
  { basePath: "/layouts-grade4/doodles/1", alt: "Альбом для 4 класса в дизайне «Каракули» — обложка" },
  { basePath: "/layouts-grade4/colored-pencils/2", alt: "Альбом для 4 класса в дизайне «Цветные карандаши» — разворот" },
  { basePath: "/layouts-grade4/calligraphy/4", alt: "Альбом для 4 класса в дизайне «Каллиграфия» — разворот" },
  { basePath: "/layouts-grade4/doodles/7", alt: "Альбом для 4 класса в дизайне «Каракули» — разворот" },
] as const;

export const participantBenefits = [
  {
    icon: Smile,
    title: "Ребёнку",
    text: "Живая съёмка без одинаковых поз: портреты, друзья, уроки, перемены и знакомая школьная жизнь.",
  },
  {
    icon: UserCheck,
    title: "Родителям",
    text: "Вы сами выбираете портрет и до печати лично подтверждаете имя и персональный разворот ребёнка.",
  },
  {
    icon: UsersRound,
    title: "Ответственному за класс",
    text: "Помогаем выбрать формат, объясняем каждый этап и принимаем замечания к макету одним общим списком.",
  },
  {
    icon: Building2,
    title: "Школе",
    text: "Заранее согласуем даты и график, а комплектацию, сроки и ответственность сторон фиксируем в договоре.",
  },
] as const;
