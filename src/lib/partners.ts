import { submitForm } from "@/lib/submitForm";

/**
 * Where a referral from /partners goes.
 *
 * The same arrangement as `lib/careers` and `lib/contact`: the form says what
 * it collects, this says where it goes, and `submitForm` does the posting.
 *
 * TODO(referral endpoint): no endpoint is chosen yet. Set
 * `NEXT_PUBLIC_REFERRAL_ENDPOINT` to any URL that accepts a JSON POST (a form
 * service, a CRM's inbound URL, a webhook) — see SETUP.md for the services the
 * other two forms already use. Until it is set, the form validates, shows its
 * "Sent" state and discards the referral, and the console says so in
 * development. Set it before the page goes live: a partner who sends an intro
 * and hears nothing has been failed, not just missed.
 */

export type Referral = {
  name: string;
  firm: string;
  email: string;
  company: string;
  contact: string;
  note: string;
};

export async function sendReferral(referral: Referral): Promise<void> {
  // TODO(referral endpoint): this is where the form endpoint goes.
  const endpoint = process.env.NEXT_PUBLIC_REFERRAL_ENDPOINT;

  if (!endpoint) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[partners] NEXT_PUBLIC_REFERRAL_ENDPOINT is not set, so the referral " +
          "was not sent anywhere. See SETUP.md.",
      );
    }
    return;
  }

  await submitForm(endpoint, { form: "referral", ...referral });
}
