import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "sonner/dist/styles.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/auth-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "200", "300"],
});

export const metadata: Metadata = {
  title: "DigitalLair Store",
  description: "Everything you need for your digital life.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}