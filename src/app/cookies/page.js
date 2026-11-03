import LegalPageShell from "@/components/shared/LegalPageShell";

export const metadata = {
  title: "Cookie Policy | BMW Reliability Guide",
  description: "How BMW Reliability Guide (bmwengines.uk) uses cookies.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie Policy">
      <p>
        This cookie policy explains how BMW Reliability Guide (bmwengines.uk) uses cookies and similar
        technologies.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the
        site work, remember preferences, and understand usage.
      </p>

      <h2>2. How we use cookies</h2>
      <ul>
        <li>
          <strong>Essential:</strong> needed for basic site functions (for example navigation and
          security)
        </li>
        <li>
          <strong>Preferences:</strong> may remember settings such as theme choice
        </li>
        <li>
          <strong>Analytics:</strong> may help us understand which pages are useful (if enabled)
        </li>
      </ul>

      <h2>3. Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Blocking some cookies may affect how
        parts of the site work.
      </p>

      <h2>4. More information</h2>
      <p>
        For how we handle personal data more broadly, see our <a href="/privacy">Privacy Policy</a>.
      </p>
    </LegalPageShell>
  );
}
