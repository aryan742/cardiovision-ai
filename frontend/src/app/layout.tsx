import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CardioVision AI // Advanced Clinical Diagnostic Interface",
  description: "Next-generation scrollytelling diagnostics platform powered by multi-biomarker neural prediction models, high-fidelity anatomical sequences, and active clinical dashboards.",
  keywords: ["Heart Disease Prediction", "Diabetes Diagnostics", "Breast Cancer ML", "Cinematic Medical Storytelling", "Health Telemetry Interface"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#050505] antialiased selection:bg-teal-500/20 selection:text-teal-300`}>
        {children}
      </body>
    </html>
  );
}
