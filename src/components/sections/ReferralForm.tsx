"use client";

import { useId } from "react";

import {
  Field,
  FormSubmit,
  Honeypot,
  formControl,
  formLine,
  type FormCopy,
} from "@/components/ui/Field";
import { sendReferral } from "@/lib/partners";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { cn } from "@/lib/cn";

/**
 * The referral form — six fields and a button.
 *
 * Built from the same parts as the contact and application forms (see
 * components/ui/Field, and lib/useFormSubmit for the sequence all three submit
 * through), so the inputs, the focus ring and the button's busy and sent
 * states are the site's own. A real `<form>` with real labels: the browser's
 * validation catches an empty required field without a line of script.
 *
 * Where it goes is `lib/partners`, which carries the TODO for the endpoint.
 */

type ReferralFormProps = {
  content: FormCopy & {
    /** Named for assistive tech, which announces the form by it. */
    label: string;
    fields: Record<
      "name" | "firm" | "email" | "company" | "contact" | "note",
      { label: string; placeholder: string }
    >;
  };
};

export function ReferralForm({ content }: ReferralFormProps) {
  const id = useId();
  const { fields } = content;

  const { status, onSubmit } = useFormSubmit({
    failureLog: "[partners] referral failed to send.",
    send: (data) =>
      sendReferral({
        name: String(data.get("name") ?? ""),
        firm: String(data.get("firm") ?? ""),
        email: String(data.get("email") ?? ""),
        company: String(data.get("company") ?? ""),
        contact: String(data.get("contact") ?? ""),
        note: String(data.get("note") ?? ""),
      }),
  });

  /** One single-line field. */
  const line = (
    name: "name" | "firm" | "email" | "company" | "contact",
    type: string,
    autoComplete: string,
    className?: string,
  ) => (
    <Field htmlFor={`${id}-${name}`} label={fields[name].label} className={className}>
      <input
        id={`${id}-${name}`}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={fields[name].placeholder}
        className={cn(formControl, formLine)}
      />
    </Field>
  );

  return (
    <form
      aria-label={content.label}
      onSubmit={onSubmit}
      // The application form's spacing: 20 between fields, 32 above and below.
      // Two columns from tablet up, where a name and a firm sit happily side by
      // side; one on a phone.
      className="grid grid-cols-1 gap-5 px-5 py-8 tablet:grid-cols-2 tablet:px-8"
    >
      <Honeypot />

      {line("name", "text", "name")}
      {line("firm", "text", "organization")}
      {line("email", "email", "email")}
      {line("company", "text", "off")}
      {line("contact", "text", "off", "tablet:col-span-2")}

      <Field
        htmlFor={`${id}-note`}
        label={fields.note.label}
        className="tablet:col-span-2"
      >
        <textarea
          id={`${id}-note`}
          name="note"
          rows={4}
          placeholder={fields.note.placeholder}
          // `py-3` because a text area, unlike an input, sets its first line
          // hard against the top edge.
          className={cn(formControl, "h-[100px] resize-y px-4 py-3")}
        />
      </Field>

      {/* The site's call-to-action width from tablet up: the shared submit runs
          full width of whatever holds it. */}
      <div className="flex flex-col gap-3 tablet:col-span-2 tablet:w-[267px]">
        <FormSubmit status={status} content={content} />
      </div>
    </form>
  );
}
