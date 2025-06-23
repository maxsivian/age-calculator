import "./globals.css";
import ReduxProviderWrapper from "./ReduxProviderWrapper";

export const metadata = {
  title: "AGE CALCULATOR",
  description: "Accurately calculate your age in years, months, and days using this free and easy-to-use age calculator.",
  authors: [{ name: "maxsivian" }],
  keywords: [
    "age calculator",
    "calculate age",
    "date of birth calculator",
    "age finder",
    "how old am I",
    "birthday calculator",
    "age in months and days"
  ],
  robots: "index, follow",
  metadataBase: new URL("https://age-calculator-maxsivians-projects.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AGE CALCULATOR",
    description: "Accurately calculate your age in years, months, and days using this free and easy-to-use age calculator.",
    url: "https://age-calculator-maxsivians-projects.vercel.app/logo.png",
    type: "website",
    images: ["https://age-calculator-maxsivians-projects.vercel.app/logo.png"],

  },
  twitter: {
    card: "summary_large_image",
    title: "AGE CALCULATOR",
    description: "Accurately calculate your age in years, months, and days using this free and easy-to-use age calculator.",
    images: ["https://age-calculator-maxsivians-projects.vercel.app/logo.png"],
    site: "@maxsivian",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProviderWrapper>
          {children}
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
