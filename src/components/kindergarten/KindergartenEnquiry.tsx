import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, X } from "lucide-react";
import { albumPackages } from "@/config/albumPackages";
import { schoolText, type AlbumAudience } from "@/config/albumAudience";
import { business } from "@/config/business";
import { contacts } from "@/config/contacts";
import { reachGoal } from "@/lib/analytics";
import { buildKindergartenLead, emptyKindergartenLead, validateKindergartenLead } from "@/lib/kindergartenLead";
import type { KindergartenLeadValues } from "@/lib/kindergartenLead";
import "./kindergarten-enquiry.css";

/** Same root element as the approved page. Only mobile enquiry links opt into the dialog. */
export function KindergartenEnquiryShell({ children, className, enabled, audience = "kindergarten" }: {
  children: ReactNode; className: string; enabled: boolean; audience?: AlbumAudience;
}) {
  const isSchool = audience !== "kindergarten";
  const pagePath = audience === "grade4" ? "/school/4" : audience === "school" ? "/school/9-11" : "/kindergarten";
  const leadAudience = isSchool ? "school" : "kindergarten";
  const packages = isSchool ? albumPackages.map((album) => ({ ...album, title: schoolText(album.title, audience) })) : albumPackages;
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<KindergartenLeadValues>({ ...emptyKindergartenLead });
  const [errors, setErrors] = useState<ReturnType<typeof validateKindergartenLead>>({});
  const [failure, setFailure] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [extras, setExtras] = useState(false);
  const [viewport, setViewport] = useState<{ height: number; bottom: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const startedAt = useRef(Date.now());
  const interactedWithCatalog = useRef(false);
  const started = useRef(false);
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const placement = useRef("mobile_enquiry");
  const selectedAlbum = packages.find((album) => album.id === values.albumId);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { if (!enabled) setOpen(false); }, [enabled]);
  useEffect(() => {
    if (!open || !enabled) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setViewport({ height: vv.height, bottom: Math.max(0, innerHeight - vv.height - vv.offsetTop) });
    update(); vv.addEventListener("resize", update); vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, [open, enabled]);

  const captureEnquiry = (event: MouseEvent<HTMLDivElement>) => {
    if (!enabled || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !root.current?.contains(target)) return;
    if (target.closest(".km-v2-tab")) interactedWithCatalog.current = true;
    const trigger = target.closest<HTMLElement>("a[href], button[data-enquiry-open]");
    if (!trigger) return;
    if (trigger instanceof HTMLAnchorElement) {
      if (trigger.target === "_blank" || trigger.hasAttribute("download")) return;
      const url = new URL(trigger.getAttribute("href") || "", location.href);
      if (url.origin !== location.origin || url.hash !== "#cta" || ![pagePath, `${pagePath}/`].includes(url.pathname)) return;
    }
    event.preventDefault(); event.stopPropagation();
    opener.current = trigger;
    const inCatalog = Boolean(trigger.closest(".km-catalog-v2"));
    placement.current = inCatalog ? "mobile_catalog" : trigger.closest(".kg-hero") ? "mobile_hero" : trigger.closest(".fixed") ? "mobile_sticky" : "mobile_inline";
    if (!sent && (inCatalog || interactedWithCatalog.current)) {
      const id = root.current.querySelector<HTMLElement>(".km-v2-card")?.dataset.selectedAlbum;
      if (albumPackages.some((album) => album.id === id)) setValues((previous) => ({ ...previous, albumId: id! }));
    }
    setOpen(true);
    reachGoal("consultation_click", { page: isSchool ? audience : "kindergarten", placement: placement.current });
  };
  const update = (key: keyof KindergartenLeadValues, value: string | boolean) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    if (!started.current) {
      started.current = true;
      reachGoal("lead_form_start", { direction: "album", audience: leadAudience, placement: "mobile_enquiry" });
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current || sent) return;
    const invalid = validateKindergartenLead(values, isSchool ? "школы" : "детского сада");
    setErrors(invalid); setFailure("");
    if (Object.keys(invalid).length) {
      requestAnimationFrame(() => document.getElementById(`kg-lead-${Object.keys(invalid)[0]}`)?.focus());
      return;
    }
    inFlight.current = true; setSending(true);
    const abort = new AbortController(); controller.current = abort;
    const timer = window.setTimeout(() => abort.abort(), 20000);
    try {
      const payload = buildKindergartenLead(values, {
        page: location.href, referrer: document.referrer, startedAt: startedAt.current, now: Date.now(),
        consentVersion: business.consentVersion, privacyPolicyVersion: business.privacyPolicyVersion,
        albumTitle: selectedAlbum?.title, audience: leadAudience, schoolLevel: isSchool ? audience === "grade4" ? "grade4" : "grade9_11" : undefined,
      });
      const response = await fetch(import.meta.env.VITE_LEAD_WEBHOOK_URL || "/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: abort.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true || !result?.leadId) {
        throw new Error(response.status === 429 ? "rate_limit" : "delivery");
      }
      setSent(true); setValues({ ...emptyKindergartenLead }); setExtras(false);
      reachGoal("lead_success", { direction: "album", audience: leadAudience, placement: "mobile_enquiry", ...(selectedAlbum ? { album_id: selectedAlbum.id } : {}) });
      requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
    } catch (error) {
      setFailure(error instanceof Error && error.message === "rate_limit"
        ? "Слишком много попыток. Подождите немного или позвоните нам. Заполненные данные сохранены."
        : "Не удалось подтвердить отправку. Данные сохранены. Попробуйте позже или позвоните нам, чтобы уточнить получение заявки.");
    } finally {
      clearTimeout(timer); controller.current = null; inFlight.current = false; setSending(false);
    }
  };
  const field = (key: "name" | "phone" | "institution", label: string, placeholder: string) => (
    <div className="kg-lead-field">
      <label htmlFor={`kg-lead-${key}`}>{label} *</label>
      <input id={`kg-lead-${key}`} name={key} type={key === "phone" ? "tel" : "text"}
        inputMode={key === "phone" ? "tel" : "text"} autoComplete={key === "institution" ? "organization" : key === "phone" ? "tel" : "name"}
        required maxLength={key === "institution" ? 140 : key === "name" ? 80 : 30} disabled={sending}
        value={values[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder}
        aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `kg-lead-${key}-error` : undefined} />
      {errors[key] && <p className="kg-lead-error" id={`kg-lead-${key}-error`}>{errors[key]}</p>}
    </div>
  );

  return (
    <div ref={root} className={className} onClickCapture={captureEnquiry} onKeyUpCapture={(event) => {
      if (enabled && (event.target as HTMLElement).closest?.(".km-v2-tab")) interactedWithCatalog.current = true;
    }}>
      {children}
      <Dialog.Root open={enabled && open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="kg-lead-overlay" />
          <Dialog.Content className="kg-lead-dialog" style={viewport ? { maxHeight: `${Math.max(120, viewport.height - 12)}px`, bottom: `${viewport.bottom}px` } : undefined}
            onOpenAutoFocus={(event) => { event.preventDefault(); title.current?.focus({ preventScroll: true }); }}
            onCloseAutoFocus={(event) => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus({ preventScroll: true }); }}>
            <header className="kg-lead-heading">
              <div>
                <Dialog.Title ref={title} tabIndex={-1}>{sent ? "Заявка принята" : isSchool ? "Рассчитаем для вашего класса" : "Рассчитаем для вашей группы"}</Dialog.Title>
                <Dialog.Description>{sent ? "Спасибо за обращение в «Дети в кадре»." : "Оставьте контакты — уточним детали и подготовим расчёт."}</Dialog.Description>
              </div>
              <Dialog.Close className="kg-lead-close" aria-label="Закрыть заявку"><X size={22} aria-hidden="true" /></Dialog.Close>
            </header>
            <div className="kg-lead-body">
              {sent ? <div className="kg-lead-success" role="status">
                <CheckCircle2 size={44} aria-hidden="true" />
                <p>Свяжемся с вами в течение рабочего дня.</p>
                <p>Это заявка на консультацию, а не оформление заказа или обязательство оплаты.</p>
                <Dialog.Close className="kg-lead-submit">Вернуться к альбомам</Dialog.Close>
                <button type="button" className="kg-lead-link" onClick={() => { setSent(false); setErrors({}); setFailure(""); started.current = false; }}>Новая заявка</button>
              </div> : <form noValidate onSubmit={submit} aria-busy={sending}>
                <div className="kg-lead-choice"><span>{selectedAlbum ? `Для расчёта: ${selectedAlbum.title}` : "Поможем выбрать подходящий альбом"}</span>
                  <button type="button" onClick={() => setExtras((previous) => !previous)} aria-expanded={extras} aria-controls="kg-lead-extras">{selectedAlbum ? "Изменить" : "Выбрать"}</button>
                </div>
                {field("name", "Ваше имя", "Как к вам обращаться")}
                {field("phone", "Телефон", "+7 999 000-00-00")}
                {field("institution", isSchool ? "Номер или название школы" : "Номер или название детского сада", isSchool ? "Например, школа № 129" : "Например, № 108, Приморский район")}
                <button type="button" className="kg-lead-extras-toggle" aria-expanded={extras} aria-controls="kg-lead-extras" onClick={() => setExtras((previous) => !previous)}>
                  {extras ? "Скрыть дополнительные поля" : "Количество детей и пожелания — необязательно"}
                </button>
                <div id="kg-lead-extras" hidden={!extras}>
                  <div className="kg-lead-field"><label htmlFor="kg-lead-album">Формат для расчёта</label>
                    <select id="kg-lead-album" value={values.albumId} disabled={sending} onChange={(event) => update("albumId", event.target.value)}>
                      <option value="">Помогите выбрать</option>{packages.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
                    </select>
                  </div>
                  <div className="kg-lead-field"><label htmlFor="kg-lead-count">{isSchool ? "Сколько детей в классе?" : "Сколько детей в группе?"}</label>
                    <select id="kg-lead-count" value={values.childrenCount} disabled={sending} onChange={(event) => update("childrenCount", event.target.value)}>
                      <option value="">Пока не знаю</option>{["10–15", "16–20", "21–25", "Больше 25"].map((count) => <option key={count}>{count}</option>)}
                    </select>
                  </div>
                  <div className="kg-lead-field"><label htmlFor="kg-lead-comment">Пожелания или вопрос</label>
                    <textarea id="kg-lead-comment" maxLength={600} rows={3} disabled={sending} value={values.comment} onChange={(event) => update("comment", event.target.value)} />
                    <p className="kg-lead-note">Не указывайте ФИО детей, сведения о здоровье и другие чувствительные данные.</p>
                  </div>
                </div>
                <div className="kg-lead-honeypot" aria-hidden="true"><label htmlFor="kg-lead-website">Ваш сайт</label>
                  <input id="kg-lead-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
                </div>
                <label className="kg-lead-consent" htmlFor="kg-lead-consent"><input id="kg-lead-consent" type="checkbox" required checked={values.consent} disabled={sending}
                  aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "kg-lead-consent-error" : undefined} onChange={(event) => update("consent", event.target.checked)} />
                  <span>Даю <a href="/personal-data-consent" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> для ответа на заявку.</span>
                </label>
                {errors.consent && <p className="kg-lead-error" id="kg-lead-consent-error">{errors.consent}</p>}
                <p className="kg-lead-note"><a href="/privacy" target="_blank" rel="noopener noreferrer">Политика обработки персональных данных</a></p>
                {failure && <p className="kg-lead-failure" role="alert">{failure}</p>}
                <button className="kg-lead-submit" type="submit" disabled={sending}>{sending ? "Отправляем…" : "Получить расчёт"}</button>
                <p className="kg-lead-note">Ответим в течение рабочего дня. Без обязательств.</p>
              </form>}
              <a className="kg-lead-phone" href={contacts.phone.href}>Позвонить: {contacts.phone.display}</a>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export function KindergartenEnquirySection({ audience = "kindergarten" }: { audience?: AlbumAudience }) {
  return <section id="cta" className="kg-lead-section">
    <h2>{audience === "kindergarten" ? "Рассчитаем альбомы для вашей группы" : "Рассчитаем альбомы для вашего класса"}</h2>
    <p>Поможем выбрать формат, уточним количество детей и свободные даты.</p>
    <button type="button" className="kg-lead-submit" data-enquiry-open>Оставить заявку на расчёт</button>
  </section>;
}
