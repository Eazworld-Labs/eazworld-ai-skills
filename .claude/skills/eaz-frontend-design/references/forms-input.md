# Forms & Input

Companion to the `eaz-frontend-design` skill. Design and implement reliable, accessible,
user-friendly forms. Prioritises React, Next.js, TypeScript, HTML form elements, React
Hook Form, and Zod.

## Form architecture

- **Structure:** group related fields with `<fieldset>` and `<legend>`; split long forms
  into logical sections.
- **Reusable components:** build once (text input, select, checkbox, radio, file upload)
  and reuse — see [Component Architecture](#component-architecture).
- **Controlled vs uncontrolled:** prefer controlled inputs in React for validation and
  submission; uncontrolled for simple cases or file inputs.
- **State management:** lift form state to the form level; avoid prop drilling — use
  React Hook Form or Next.js form actions.
- **Multi-step forms:** persist progress, validate per step, allow backward navigation,
  show step indicators.
- **Conditional/dynamic fields:** show/hide based on previous answers; keep accessible
  when fields appear/disappear.

## Input types

| Type | Use when | Notes |
| :--- | :--- | :--- |
| Text | General text | Visible `<label>` |
| Email | Email addresses | Browser + custom validation |
| Password | Passwords | `autocomplete="new-password"`, visibility toggle |
| Telephone | Phone numbers | `inputmode="tel"`, country-aware formatting |
| Number | Numeric values | `min`/`max`/`step`; not for IDs or cards |
| Date/time | Dates/times | `<input type="date">` / `datetime-local` |
| Select / Multiselect | Options | Native `<select>` or APG combobox |
| Radio | Single choice from few | Visible labels, `name` groups them |
| Checkbox | Multiple choices | Each with its own `<label>` |
| File upload | File submission | Accept types, max size, accessible drop zone |
| Search | Search | `role="search"`, `autocomplete="search"` |
| Textarea | Multi-line text | `rows`/`cols`, associate with `<label>` |

## Validation

- **Client-side:** immediate feedback on blur/change; prevent invalid submission.
- **Server-side:** authoritative — never trust client validation alone.
- **Required fields:** `required` attribute + visual indicator; announced to screen
  readers.
- **Constraints:** `min`/`max`/`minLength`/`maxLength`/`pattern`/`type`.
- **Cross-field:** password confirmation, end-date after start-date.
- **Real-time + on-submit:** validate on blur/change for UX; re-validate on submit.
- **Clear errors:** say what went wrong and how to fix it, near the field, via
  `aria-describedby` + `aria-invalid="true"`.
- **Prevent invalid submissions:** disable submit when constraints unmet, but validate on
  submit too.

## User experience

- Every field has a visible `<label>`; placeholders are hints, not labels.
- Help text below fields, associated via `aria-describedby`.
- Required/optional indicators consistent; mark only the minority.
- Loading states during submission; disable submit during load.
- Success/error feedback after submit; field-level errors inline, form-level summary top.
- Preserve form data after recoverable errors; never clear on error.
- Prevent duplicate submissions (client disable + server idempotency).

## Security

- Server re-validates everything; client validation is UX only.
- Sanitise input, escape on render; no raw HTML injection (`dangerouslySetInnerHTML`,
  `v-html`).
- File uploads: validate MIME type and size on server; sanitise filenames; store outside
  web root; use signed URLs.
- CSRF protection for state-changing forms.
- Generic error messages to users; details logged server-side.

**Example — React Hook Form + Zod:**

```tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  agree: z.boolean().refine((v) => v === true, 'You must agree to the terms'),
});

export function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } }
    = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit((data) => {})} noValidate>
      <label htmlFor="email">Email address</label>
      <input id="email" {...register('email')} type="email" required />
      {errors.email && <span role="alert">{errors.email.message}</span>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up…' : 'Sign up'}
      </button>
    </form>
  );
}
```

## Localisation

Use [Localisation](./localisation.md) for country-specific inputs: phone (E.164 +233/+234),
currency (GH₵/₦), date (DD/MM/YYYY), number formats, localised validation messages,
country-aware address fields. Do not hardcode Ghana-specific rules into every form.
