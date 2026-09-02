import { createServer } from "node:http";

const config = {
  port: Number(process.env.PORT || 8787),
  amoBaseUrl: process.env.AMO_BASE_URL || "https://dmitrymelnik.amocrm.ru",
  amoToken: process.env.AMO_LONG_TOKEN || "",
  photoDayPipelineId: Number(process.env.AMO_PHOTODAY_PIPELINE_ID || 1882579),
  albumPipelineId: Number(process.env.AMO_ALBUM_PIPELINE_ID || 1973458),
  allowedOrigins: new Set((process.env.ALLOWED_ORIGINS || "https://detivkadre.spb.ru,https://www.detivkadre.spb.ru,http://127.0.0.1:8080,http://127.0.0.1:8082").split(",")),
};

const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const json = (res, status, body) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(body));
};

const normalizePhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith("7")) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  return "";
};

const clean = (value, max) => String(value || "").trim().replace(/\s+/g, " ").slice(0, max);

const rateLimited = (ip) => {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_ATTEMPTS;
};

const readBody = async (req) => {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 16_384) throw new Error("payload_too_large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const amoRequest = async (path, options = {}) => {
  const response = await fetch(`${config.amoBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.amoToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`amo_${response.status}:${detail.slice(0, 300)}`);
  }
  return response.status === 204 ? null : response.json();
};

const phoneFromContact = (contact) => {
  const phoneField = (contact.custom_fields_values || []).find((field) => field.field_code === "PHONE");
  return normalizePhone(phoneField?.values?.[0]?.value);
};

const findOrCreateContact = async ({ name, phone }) => {
  const result = await amoRequest(`/api/v4/contacts?query=${encodeURIComponent(phone)}&limit=20`);
  const exact = (result?._embedded?.contacts || []).find((contact) => phoneFromContact(contact) === phone);
  if (exact) return exact.id;

  const created = await amoRequest("/api/v4/contacts", {
    method: "POST",
    body: JSON.stringify([{
      name,
      custom_fields_values: [{ field_code: "PHONE", values: [{ value: phone, enum_code: "WORK" }] }],
    }]),
  });
  return created._embedded.contacts[0].id;
};

const createLead = async (lead) => {
  const pipelineId = lead.direction === "album" ? config.albumPipelineId : config.photoDayPipelineId;
  const product = lead.direction === "album" ? "Выпускные альбомы" : "Фотодень";
  const audience = lead.audience === "school" ? "Школа" : "Детский сад";
  const contactId = await findOrCreateContact(lead);
  const created = await amoRequest("/api/v4/leads", {
    method: "POST",
    body: JSON.stringify([{
      name: `${product} — ${lead.institution}`,
      pipeline_id: pipelineId,
      _embedded: {
        contacts: [{ id: contactId, is_main: true }],
        tags: [{ name: "Заявка с сайта" }],
      },
    }]),
  });
  const leadId = created._embedded.leads[0].id;
  const note = [
    `Заявка с сайта detivkadre.spb.ru`,
    `Продукт: ${product}`,
    `Учреждение: ${audience} — ${lead.institution}`,
    lead.childrenCount ? `Количество детей: ${lead.childrenCount}` : "Количество детей: не указано",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.comment ? `Комментарий: ${lead.comment}` : "Комментарий: не указан",
    `Страница: ${lead.page}`,
    `Согласие: ${lead.consent.givenAt}; версия ${lead.consent.version}`,
    `Политика: версия ${lead.privacyPolicyVersion}`,
  ].join("\n");
  await amoRequest(`/api/v4/leads/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify([{ note_type: "common", params: { text: note } }]),
  });
  return leadId;
};

const server = createServer(async (req, res) => {
  if (req.url === "/healthz") return json(res, 200, { ok: true });
  if (req.url !== "/api/leads" || req.method !== "POST") return json(res, 404, { ok: false });

  const origin = req.headers.origin || "";
  if (origin && !config.allowedOrigins.has(origin)) return json(res, 403, { ok: false, error: "origin" });
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) return json(res, 415, { ok: false, error: "content_type" });

  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  if (rateLimited(ip)) return json(res, 429, { ok: false, error: "rate_limit" });

  try {
    const body = await readBody(req);
    if (body.website || Number(body.formElapsedMs || 0) < 1500) return json(res, 200, { ok: true });

    const lead = {
      name: clean(body.name, 80),
      phone: normalizePhone(body.phone),
      institution: clean(body.institution, 140),
      childrenCount: clean(body.childrenCount, 40),
      comment: clean(body.comment, 800),
      direction: body.direction === "album" ? "album" : "photo-day",
      audience: body.audience === "school" ? "school" : "kindergarten",
      page: clean(body.page, 300),
      consent: {
        given: body.consent?.given === true,
        version: clean(body.consent?.version, 30),
        givenAt: clean(body.consent?.givenAt, 40),
      },
      privacyPolicyVersion: clean(body.privacyPolicyVersion, 30),
    };

    if (!lead.name || !lead.phone || !lead.institution || !lead.consent.given || !lead.consent.givenAt) {
      return json(res, 400, { ok: false, error: "validation" });
    }
    if (!config.amoToken) return json(res, 503, { ok: false, error: "not_configured" });

    const leadId = await createLead(lead);
    return json(res, 201, { ok: true, leadId });
  } catch (error) {
    console.error("Lead submission failed", error instanceof Error ? error.message : error);
    return json(res, 502, { ok: false, error: "delivery" });
  }
});

server.listen(config.port, "0.0.0.0", () => {
  console.log(`Lead API listening on ${config.port}`);
});
