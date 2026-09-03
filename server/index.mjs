import { createServer } from "node:http";

const config = {
  port: Number(process.env.PORT || 8787),
  amoBaseUrl: process.env.AMO_BASE_URL || "https://dmitrymelnik.amocrm.ru",
  amoToken: process.env.AMO_LONG_TOKEN || "",
  photoDayPipelineId: Number(process.env.AMO_PHOTODAY_PIPELINE_ID || 1882579),
  albumPipelineId: Number(process.env.AMO_ALBUM_PIPELINE_ID || 1973458),
  fields: {
    institution: Number(process.env.AMO_FIELD_INSTITUTION || 743411),
    product: Number(process.env.AMO_FIELD_LEAD_PRODUCT || 743715),
    audience: Number(process.env.AMO_FIELD_AUDIENCE || 743717),
    source: Number(process.env.AMO_FIELD_LEAD_SOURCE || 743719),
    page: Number(process.env.AMO_FIELD_LEAD_PAGE || 743721),
    childrenCount: Number(process.env.AMO_FIELD_LEAD_CHILDREN_COUNT || 743723),
  },
  enums: {
    photoDay: Number(process.env.AMO_ENUM_PRODUCT_PHOTODAY || 1002233),
    album: Number(process.env.AMO_ENUM_PRODUCT_ALBUM || 1002235),
    kindergarten: Number(process.env.AMO_ENUM_AUDIENCE_KINDERGARTEN || 1002237),
    school: Number(process.env.AMO_ENUM_AUDIENCE_SCHOOL || 1002239),
  },
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
  const customFields = [
    { field_id: config.fields.institution, values: [{ value: lead.institution }] },
    { field_id: config.fields.product, values: [{ enum_id: lead.direction === "album" ? config.enums.album : config.enums.photoDay }] },
    { field_id: config.fields.audience, values: [{ enum_id: lead.audience === "school" ? config.enums.school : config.enums.kindergarten }] },
    { field_id: config.fields.source, values: [{ value: lead.source }] },
    { field_id: config.fields.page, values: [{ value: lead.page }] },
    ...(lead.childrenCount ? [{ field_id: config.fields.childrenCount, values: [{ value: lead.childrenCount }] }] : []),
    ...[
      ["UTM_SOURCE", lead.tracking.utmSource],
      ["UTM_MEDIUM", lead.tracking.utmMedium],
      ["UTM_CAMPAIGN", lead.tracking.utmCampaign],
      ["UTM_CONTENT", lead.tracking.utmContent],
      ["UTM_TERM", lead.tracking.utmTerm],
      ["YCLID", lead.tracking.yclid],
      ["REFERRER", lead.tracking.referrer],
    ].filter(([, value]) => value).map(([fieldCode, value]) => ({ field_code: fieldCode, values: [{ value }] })),
  ];
  const created = await amoRequest("/api/v4/leads", {
    method: "POST",
    body: JSON.stringify([{
      name: `${product} — ${lead.institution}`,
      pipeline_id: pipelineId,
      custom_fields_values: customFields,
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
    lead.tracking.utmSource ? `UTM source: ${lead.tracking.utmSource}` : "UTM source: не указан",
    lead.tracking.utmMedium ? `UTM medium: ${lead.tracking.utmMedium}` : "UTM medium: не указан",
    lead.tracking.utmCampaign ? `UTM campaign: ${lead.tracking.utmCampaign}` : "UTM campaign: не указан",
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
      source: clean(body.source, 80) || "detivkadre.spb.ru",
      direction: body.direction === "album" ? "album" : "photo-day",
      audience: body.audience === "school" ? "school" : "kindergarten",
      page: clean(body.page, 300),
      tracking: {
        utmSource: clean(body.tracking?.utmSource, 120),
        utmMedium: clean(body.tracking?.utmMedium, 120),
        utmCampaign: clean(body.tracking?.utmCampaign, 160),
        utmContent: clean(body.tracking?.utmContent, 160),
        utmTerm: clean(body.tracking?.utmTerm, 160),
        yclid: clean(body.tracking?.yclid, 200),
        referrer: clean(body.tracking?.referrer, 300),
      },
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
