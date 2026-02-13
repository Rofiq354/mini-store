import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-16">{children}</main>
        <Footer />
      </div>
    </>
  );
}
