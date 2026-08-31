import { FormEvent, useEffect, useState } from "react";
import { Camera, CheckCircle2, GraduationCap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { business } from "@/config/business";

type Direction = "photo-day" | "album";
type Audience = "kindergarten" | "school";

const directions = {
  "photo-day": {
    label: "Организовать фотодень",
    shortLabel: "Фотодень",
    description: "Подберём подходящую съёмку и свободную дату.",
    icon: Camera,
  },
  album: {
    label: "Заказать выпускные альбомы",
    shortLabel: "Выпускные альбомы",
    description: "Поможем выбрать формат и рассчитаем заказ для группы или класса.",
    icon: GraduationCap,
  },
};

const CTA = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [direction, setDirection] = useState<Direction>("photo-day");
  const [audience, setAudience] = useState<Audience>("kindergarten");
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    institution: "",
    comment: "",
    consent: false,
  });

  useEffect(() => {
    if (searchParams.get("direction") === "album") setDirection("album");
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.phone || !formData.institution || !formData.consent) {
      toast({
        title: "Проверьте данные",
        description: "Заполните обязательные поля и подтвердите согласие на обработку данных.",
        variant: "destructive",
      });
      return;
    }

    const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
      toast({
        title: "Форма готова к подключению",
        description: "Отправка заработает после подключения amoCRM. Сейчас можно позвонить по номеру в шапке сайта.",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          institution: formData.institution,
          comment: formData.comment,
          direction,
          audience,
          source: "detivkadre.spb.ru",
          page: window.location.href,
          consent: {
            given: true,
            version: business.consentVersion,
            givenAt: new Date().toISOString(),
          },
          privacyPolicyVersion: business.privacyPolicyVersion,
        }),
      });
      if (!response.ok) throw new Error("Lead submission failed");
      toast({ title: "Заявка отправлена", description: "Свяжемся с вами и уточним детали." });
      setFormData({ name: "", phone: "", institution: "", comment: "", consent: false });
    } catch {
      toast({
        title: "Не удалось отправить заявку",
        description: "Попробуйте ещё раз или позвоните по номеру в шапке сайта.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="cta" className="py-16 md:py-24 bg-accent-soft scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-3 font-semibold text-primary">Обсудим вашу съёмку</p>
            <h2 className="mb-5 text-4xl font-bold text-foreground md:text-5xl">
              Оставьте заявку — мы предложим подходящий вариант
            </h2>
            <p className="text-lg text-muted-foreground">
              Для детского сада или школы. Без обязательств и долгих анкет.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-2xl border border-border bg-background shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-gradient-card p-6 md:p-10">
              <h3 className="mb-5 text-xl font-bold text-foreground">Что вас интересует?</h3>
              <div className="space-y-3">
                {(Object.entries(directions) as [Direction, typeof directions[Direction]][]).map(([value, item]) => {
                  const Icon = item.icon;
                  const active = direction === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDirection(value)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-background hover:border-primary/50"}`}
                    >
                      <div className="flex gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.label}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                {["Уточним задачу и количество детей", "Предложим формат и свободные даты", "Заранее объясним стоимость и этапы"].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Вы выбрали</p>
                <h3 className="text-2xl font-bold text-foreground">{directions[direction].shortLabel}</h3>
              </div>

              <div className="mb-5">
                <Label className="mb-2 block">Учреждение *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={audience === "kindergarten" ? "default" : "outline"} onClick={() => setAudience("kindergarten")}>Детский сад</Button>
                  <Button type="button" variant={audience === "school" ? "default" : "outline"} onClick={() => setAudience("school")}>Школа</Button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="lead-name">Ваше имя *</Label>
                  <Input id="lead-name" className="mt-2" autoComplete="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Дмитрий" />
                </div>
                <div>
                  <Label htmlFor="lead-phone">Телефон *</Label>
                  <Input id="lead-phone" className="mt-2" type="tel" inputMode="tel" autoComplete="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="+7 999 000-00-00" />
                </div>
              </div>

              <div className="mt-5">
                <Label htmlFor="lead-institution">Название или номер учреждения *</Label>
                <Input id="lead-institution" className="mt-2" value={formData.institution} onChange={(event) => setFormData({ ...formData, institution: event.target.value })} placeholder="Например, детский сад № 25" />
              </div>

              <div className="mt-5">
                <Label htmlFor="lead-comment">Комментарий</Label>
                <Textarea id="lead-comment" className="mt-2 min-h-24" value={formData.comment} onChange={(event) => setFormData({ ...formData, comment: event.target.value })} placeholder="Количество детей, желаемые даты или вопрос" />
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Не указывайте здесь ФИО ребёнка, сведения о здоровье и другие чувствительные данные.
                </p>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                <input type="checkbox" required className="mt-1 h-4 w-4 accent-primary" checked={formData.consent} onChange={(event) => setFormData({ ...formData, consent: event.target.checked })} />
                <span>
                  Даю отдельное <Link to="/personal-data-consent" target="_blank" className="text-primary underline">согласие на обработку персональных данных</Link> для ответа на заявку.
                </span>
              </label>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Перед отправкой ознакомьтесь с <Link to="/privacy" target="_blank" className="text-primary underline">политикой обработки персональных данных</Link>.
              </p>

              <Button type="submit" size="xl" className="mt-6 w-full" disabled={isSending}>
                {isSending ? "Отправляем…" : "Получить консультацию"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Менеджер свяжется с вами в течение рабочего дня.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
