# Localisation

Companion to the `eaz-frontend-design` skill. Implement country-specific formatting
and regional behaviour in web applications — currency, phone numbers, dates,
addresses, taxes, shipping, and translations — using JavaScript `Intl` APIs and
TypeScript.

## Currency formatting

Use ISO 4217 currency codes internally and format with `Intl.NumberFormat` for the
user's locale.

| Country | Currency code | Symbol | Locale | Example |
| :--- | :--- | :--- | :--- | :--- |
| Ghana | GHS | GH₵ | en-GH | GH₵1,250.00 |
| Nigeria | NGN | ₦ | en-NG | ₦1,250.00 |

**Rules:**

- Store monetary values as numbers in the smallest currency unit (pesewas for GHS,
  kobo for NGN) using an integer or precision-safe decimal type — never as a formatted
  string.
- Keep the currency code alongside the amount; never infer currency from a symbol or
  locale alone.
- Format for display only, at the presentation layer, using `Intl.NumberFormat` with
  `style: "currency"` and the matching locale.
- Never assume all users use the same currency; read the user's selected country or
  detect it explicitly.
- Keep currency formatting separate from currency conversion. Formatting changes how a
  value is shown; conversion changes the underlying amount.
- Never perform currency conversion without an actual exchange rate from a trusted
  source. Store the rate, the source, and the timestamp with any converted amount.

**Example (TypeScript):**

```ts
type Money = {
  amount: number; // smallest currency unit (integer)
  currency: string; // ISO 4217, e.g. "GHS" or "NGN"
};

const CURRENCY_LOCALE: Record<string, string> = {
  GHS: 'en-GH',
  NGN: 'en-NG',
};

export function formatMoney({ amount, currency }: Money): string {
  const locale = CURRENCY_LOCALE[currency] ?? 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

// formatMoney({ amount: 125000, currency: 'GHS' }); // GH₵1,250.00
// formatMoney({ amount: 125000, currency: 'NGN' }); // ₦1,250.00
```

## Phone number formatting

| Country | Calling code | Stored (E.164) | Display example |
| :--- | :--- | :--- | :--- |
| Ghana | +233 | +233241234567 | +233 24 123 4567 |
| Nigeria | +234 | +2348031234567 | +234 803 123 4567 |

**Rules:**

- Normalise stored phone numbers to international E.164 format (`+<country code><national
  number>`) where appropriate.
- Format numbers for display separately from their stored representation; the stored
  value is canonical, the display value is localised.
- Support local input formats (e.g. `024 123 4567`, `0803 123 4567`) and international
  input formats (e.g. `+233 24 123 4567`).
- Validate phone numbers using appropriate country rules (length, prefix, permitted
  digits) before normalising.
- Do not assume every phone number belongs to Ghana — require an explicit country or
  detect it from the number's prefix.

**Example (TypeScript):**

```ts
const COUNTRY_CALLING_CODE: Record<string, string> = {
  GH: '233',
  NG: '234',
};

export function normalisePhone(raw: string, country: string): string | null {
  const digits = raw.replace(/\D/g, '');
  const code = COUNTRY_CALLING_CODE[country];

  if (digits.startsWith('0')) {
    return `+${code}${digits.slice(1)}`;
  }
  if (digits.startsWith(code)) {
    return `+${digits}`;
  }
  return null; // invalid for this country
}

export function displayPhone(e164: string): string {
  const match = e164.match(/^\+(\d{3})(\d{2})(\d{3})(\d{4})$/);
  if (!match) return e164;
  const [, code, a, b, c] = match;
  return `+${code} ${a} ${b} ${c}`;
}
```

## Date and time formatting

| Country | Locale | Time zone | Preferred display |
| :--- | :--- | :--- | :--- |
| Ghana | en-GH | Africa/Accra | DD/MM/YYYY |
| Nigeria | en-NG | Africa/Lagos | DD/MM/YYYY |

**Rules:**

- Store timestamps consistently, preferably in UTC (`2026-11-10T10:00:00Z`).
- Store date-only values as ISO date strings (`2026-11-10`), never as timestamps with
  an implicit time zone.
- Display dates according to the user's selected locale and time zone using
  `Intl.DateTimeFormat`.
- Handle time zones correctly: convert UTC to the user's zone at display time; never
  store a local wall-clock time as the source of truth.
- Distinguish date-only values (birthdays, expiry dates) from timestamps (created at,
  paid at).
- Avoid manually formatting dates (string concatenation, slicing ISO strings); use the
  `Intl` API or an appropriate library.

**Example (TypeScript):**

```ts
const COUNTRY_TIME_ZONE: Record<string, string> = {
  GH: 'Africa/Accra',
  NG: 'Africa/Lagos',
};

export function formatDate(
  isoDate: string,
  country: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const locale = country === 'GH' ? 'en-GH' : 'en-NG';
  const timeZone = COUNTRY_TIME_ZONE[country] ?? 'UTC';
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(new Date(isoDate));
}

// formatDate('2026-11-10T10:00:00Z', 'GH'); // 10/11/2026
// formatDate('2026-11-10T10:00:00Z', 'NG'); // 10/11/2026
```

## Additional localisation areas

**Country and region selection:** Provide an explicit country/region selector (not
inferred from IP alone). Persist the choice and scope currency, phone, date, tax, and
shipping behaviour to it. IP-based detection is a hint only — always allow the user to
override.

**Address formats:** Address fields differ by country (state vs region vs province,
postcode vs ZIP, required vs optional). Render the address form dynamically for the
selected country; do not force a single fixed layout on all countries.

**Postal codes:** Ghana uses postal codes (e.g. GA123456) but they are optional in many
contexts; Nigeria uses postal codes too. Validate against the selected country's rules,
and mark the field optional where the country does not require it.

**Number and decimal formatting:** Use `Intl.NumberFormat` for plain numbers and
decimals (thousands separators, decimal comma vs point differ by locale). Do not
hardcode `.` or `,` as separators.

**Language and translation management:** Separate i18n (internationalisation — making
the app translatable) from l10n (localisation — adapting for a specific region). Store
translations in JSON files keyed by language, load the active language per user
preference, and fall back to a default language when a key is missing. Right-to-left
(RTL) support is required only if an RTL language is in scope.

**Measurement units:** Use metric units for Ghana and Nigeria (kilometres, kilograms,
Celsius). Convert only at display; store a single canonical unit.

**Country-specific tax rules:** Tax (VAT, NHIL, GETFund, etc.) varies by country and by
product. Compute tax server-side using the selected country's rates; never hardcode a
single rate for all regions.

**Shipping and delivery regions:** Define delivery coverage per country/region. Show
shipping options and costs relevant to the user's selected country; hide unsupported
regions rather than erroring at checkout.

**Local payment methods:** Ghana: Mobile Money (MTN, Telecel, AT), Paystack, Hubtel.
Nigeria: bank transfer, USSD, cards, Paystack, Flutterwave, OPay. Present only the
payment methods available in the user's country.

**Country-specific validation rules:** Phone length, postal code format, tax ID format
(TIN, BVN, NIN), and ID document types differ by country. Validate against the
selected country's rules on both client and server.

**Internationalisation (i18n) versus localisation (l10n):**

- **i18n:** Designing the app so it can support multiple languages and regions without
  engineering change (externalise strings, avoid concatenation, support Unicode, no
  hardcoded date/number formats).
- **l10n:** Adapting the app for a specific region (translate strings, set currency GH₵
  vs ₦, format DD/MM/YYYY, route phone validation to Ghana vs Nigeria rules).
- i18n is done once; l10n is repeated per country.

## Implementation rules

- Use `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.DisplayNames` before reaching
  for a library.
- Prioritise JavaScript, TypeScript, React, and Next.js implementations.
- Formatting is presentation only; storage, computation, and validation remain
  server-authoritative.
- Never assume all users share the same currency, phone country, date format, or
  language.
