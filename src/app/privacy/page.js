import LegalPageShell from "@/components/shared/LegalPageShell";

export const metadata = {
  title: "Privacy Policy | BMW Reliability Guide",
  description:
    "How BMW Reliability Guide (bmwengines.uk) collects and uses personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p>
        This privacy policy explains how BMW Reliability Guide (bmwengines.uk)
        handles personal information when you use our website or submit an
        enquiry.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>Contact details you submit (name, email, phone, postcode)</li>
        <li>
          Vehicle details you provide or look up (registration, make, model,
          year, fuel type)
        </li>
        <li>Any notes or messages you include in a form</li>
        <li>
          Basic technical data such as browser type and pages visited (via
          cookies/analytics where used)
        </li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To respond to quote requests and enquiries</li>
        <li>
          To pass your request to relevant specialists where you have asked for
          help
        </li>
        <li>To improve the website and understand how it is used</li>
        <li>To meet legal or operational requirements</li>
      </ul>

      <h2>3. Sharing</h2>
      <p>
        We may share enquiry details with trusted partners, including CRM
        providers and vetted specialists, where necessary to fulfil your
        request. We do not sell your personal data. Suppliers may use your
        information only to respond to your specific enquiry and provide the
        related service. They must not use it for unrelated marketing or share
        it with third parties except where legally required. Suppliers are
        responsible for their own data-handling practices.
      </p>

      <h2>4. Retention</h2>
      <p>
        We retain enquiry data for up to 3 years from your last interaction to
        handle complaints, disputes and legal claims. After this period, we
        delete or anonymise the data unless continued retention is required by
        law. Suppliers may retain your information under their own retention
        policies. We may retain anonymised data indefinitely for analytical
        purposes.
      </p>

      <h2>5. Your rights</h2>
      <p>
        Depending on applicable law, you may ask to access, correct, or delete
        personal data we hold about you. Contact us via the{" "}
        <a href="/contact">contact page</a> to make a request.
      </p>

      <h2>6. Contact</h2>
      <p>For privacy questions, use the contact page on this website.</p>
    </LegalPageShell>
  );
}
