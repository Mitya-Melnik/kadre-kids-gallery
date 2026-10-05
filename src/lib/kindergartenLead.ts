/** Payload remains compatible with the existing /api/leads endpoint. */
export type KindergartenLeadValues = {
  name: string; phone: string; institution: string; childrenCount: string;
  comment: string; website: string; consent: boolean; albumId: string;
};
export const emptyKindergartenLead: KindergartenLeadValues = {
  name: "", phone: "", institution: "", childrenCount: "", comment: "", website: "", consent: false, albumId: "",
};
export function normalizeLeadPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+7${digits}`;
  if (digits.length === 11 && /^[78]/.test(digits)) return `+7${digits.slice(1)}`;
  return "";
}
export function validateKindergartenLead(value: KindergartenLeadValues, institutionLabel = "детского сада") {
  const errors: Partial<Record<keyof KindergartenLeadValues, string>> = {};
  if (!value.name.trim()) errors.name = "Укажите ваше имя";
  if (!normalizeLeadPhone(value.phone)) errors.phone = "Укажите российский номер: +7 и 10 цифр";
  if (!value.institution.trim()) errors.institution = `Укажите номер или название ${institutionLabel}`;
  if (!value.consent) errors.consent = "Для ответа на заявку необходимо ваше согласие";
  return errors;
}
export function buildKindergartenLead(value: KindergartenLeadValues, context: {
  page: string; referrer: string; startedAt: number; now: number;
  consentVersion: string; privacyPolicyVersion: string; albumTitle?: string; audience?: "kindergarten" | "school"; schoolLevel?: "grade4" | "grade9_11";
}) {
  const params = new URL(context.page).searchParams;
  // A calculation preference is not a confirmed purchase or discount entitlement.
  // The existing backend places comment in the amoCRM lead note; no new CRM field is required.
  const choice = context.albumTitle ? `Формат для расчёта: «${context.albumTitle}».` : "Формат не выбран — нужна консультация.";
  return {
    name: value.name.trim().slice(0, 80), phone: normalizeLeadPhone(value.phone),
    institution: value.institution.trim().slice(0, 140), childrenCount: value.childrenCount,
    comment: [choice, value.comment.trim().slice(0, 600)].filter(Boolean).join("\n"),
    website: value.website, formElapsedMs: context.now - context.startedAt,
    direction: "album", audience: context.audience ?? "kindergarten", schoolLevel: context.audience === "school" ? context.schoolLevel ?? "" : "",
    source: "detivkadre.spb.ru", page: context.page,
    tracking: {
      utmSource: params.get("utm_source") || "", utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "", utmContent: params.get("utm_content") || "",
      utmTerm: params.get("utm_term") || "", yclid: params.get("yclid") || "", referrer: context.referrer,
    },
    consent: { given: value.consent, version: context.consentVersion, givenAt: new Date(context.now).toISOString() },
    privacyPolicyVersion: context.privacyPolicyVersion,
  };
}
