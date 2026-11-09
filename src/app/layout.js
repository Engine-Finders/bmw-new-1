import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FreeQuoteSticky from "@/components/shared/FreeQuoteForm";
import { ThemeProvider } from "@/components/shared/themeProvider";

export const metadata = {
  metadataBase: new URL("https://bmwengines.uk/"),
  title: "BMW Reliability Guide",
  description: "The UK's Most Trusted BMW Ownership Guide",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/png/Icon.webp", type: "image/webp" },
    ],
    shortcut: "/png/Icon.webp",
    apple: "/png/Icon.webp",
  },
  openGraph: {
    images: [
      {
        url: "/png/123.webp",
        width: 1734,
        height: 907,
        alt: "BMW Reliability Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/png/123.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <Script
  id="microsoft-clarity"
  strategy="afterInteractive"
>
  {`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "z794bievrh");
  `}
</Script>
      <body className="min-h-full bg-[var(--color-page)] text-[var(--color-text)] antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-[var(--color-page)] text-[var(--color-text)]">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <FreeQuoteSticky />
        </ThemeProvider>
      </body>
    </html>
  );
}
