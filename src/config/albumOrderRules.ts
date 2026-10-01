/** Owner confirmed: 10 total albums per class; mix 6 and 10 pages in any ratio.
 * Other combinations still require agreement. This is not a graduation discount threshold.
 */
export const albumOrderRules = {
  minimum: 10,
  schoolMixedSummary: "6 и 10 страниц можно сочетать",
  schoolMixedDetails: "Альбомы «Наш класс» на 6 страниц и «Школьные годы» на 10 страниц можно сочетать в любом соотношении. Минимум считается суммарно на класс, а не отдельно по каждому формату.",
  otherFormats: "Сочетание с папкой, трио или «Большой историей» согласовываем отдельно до заключения договора.",
} as const;
export const schoolMinimumAnswer = `Да. Минимальный общий заказ класса — ${albumOrderRules.minimum} альбомов. ${albumOrderRules.schoolMixedDetails} ${albumOrderRules.otherFormats}`;
