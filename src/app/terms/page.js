import LegalPageShell from "@/components/shared/LegalPageShell";

export const metadata = {
  title: "Terms and Conditions | BMW Reliability Guide",
  description: "Terms and conditions for using BMW Reliability Guide (bmwengines.uk).",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms and Conditions">
      <p>
        Welcome to BMW Reliability Guide (bmwengines.uk). By using this website you agree to these
        terms. If you do not agree, please do not use the site.
      </p>

      <h2>1. About this site</h2>
      <p>
        This site provides independent editorial information about BMW engines, reliability, and
        ownership. It is not affiliated with BMW AG. Content is for general guidance only and is not
        a substitute for professional mechanical advice.
      </p>

      <h2>2. Quotes and enquiries</h2>
      <p>
        When you submit a quote or contact form, you confirm that the details you provide are
        accurate and that we may use them to respond to your request and share them with relevant
        specialists where appropriate.
      </p>

      <h2>3. Accuracy of information</h2>
      <p>
        We aim to keep information useful and up to date, but we do not guarantee completeness or
        accuracy. Costs, failure patterns, and recommendations can vary by vehicle condition and
        location.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to misuse the site, attempt unauthorised access, or use it for unlawful purposes.</p>

      <h2>5. Liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for decisions you make based on
        site content, or for any loss arising from use of the site or third-party services linked
        from it.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about these terms: use the <a href="/contact">contact page</a> or email us via the
        details shown on the site.
      </p>
    </LegalPageShell>
  );
}
